import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, FlatList, Alert, Image } from 'react-native';
import MapView, { Polygon, Marker, Circle } from 'react-native-maps';  // Import Circle
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import * as Progress from 'react-native-progress';  // Import for progress circles
import { BarChart, Grid } from 'react-native-svg-charts';  // Import for bar charts
import { Text as SvgText } from 'react-native-svg';  // Import for labels

// Import plant images
import OakImage from '../assets/oakplant.png';
import PineImage from '../assets/pineplant.png';
import CedarImage from '../assets/cedarplant.png';
import BirchImage from '../assets/birchplant.png';
import MapleImage from '../assets/mapleplant.png';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Warning: Each child in a list should have a unique "key" prop.'
]);

// Function to map plant type to marker color (shades of green)
const getMarkerColor = (plant) => {
  switch (plant) {
    case 'oak':
      return '#2e8b57'; // Dark Green
    case 'pine':
      return '#32cd32'; // Lime Green
    case 'cedar':
      return '#228b22'; // Forest Green
    case 'birch':
      return '#006400'; // Darker Green
    case 'maple':
      return '#7fff00'; // Chartreuse
    default:
      return '#2e8b57'; // Default to dark green
  }
};

const calculatePolygonArea = (coordinates) => {
  if (coordinates.length < 3) return 0;  // A polygon must have at least 3 points

  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const { latitude: x1, longitude: y1 } = coordinates[i];
    const { latitude: x2, longitude: y2 } = coordinates[(i + 1) % n];  // Next point or wrap around to the start
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);  // Return absolute value and divide by 2 to get the polygon area
};

// Function to convert meters to degrees for latitude
const metersToLatitudeDegrees = (meters) => {
  const metersPerDegreeLatitude = 111320; // Approx. meters per degree latitude
  return meters / metersPerDegreeLatitude;
};

// Function to convert meters to degrees for longitude, depending on latitude
const metersToLongitudeDegrees = (meters, latitude) => {
  const metersPerDegreeLongitude = 111320 * Math.cos(latitude * (Math.PI / 180)); // Adjust for latitude
  return meters / metersPerDegreeLongitude;
};

// Adjust the marker area calculation based on the converted latitude/longitude deltas
const calculateMarkerArea = (markers, radiusInMeters = 5) => {
  let totalArea = 0;

  markers.forEach((marker) => {
    const radiusLatitude = metersToLatitudeDegrees(radiusInMeters);
    const radiusLongitude = metersToLongitudeDegrees(radiusInMeters, marker.latitude);
    const markerArea = Math.PI * radiusLatitude * radiusLongitude;
    totalArea += markerArea;
  });

  return totalArea;
};

// Function to count markers by plant color
const countMarkersByColor = (markers) => {
  const counts = { oak: 0, pine: 0, cedar: 0, birch: 0, maple: 0 };

  markers.forEach((marker) => {
    if (counts[marker.plant] !== undefined) {
      counts[marker.plant]++;
    }
  });

  return counts;
};

// Function to create a checksum hash from a string
const createChecksum = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash.toString();
};

// Plant options with respective images
const plantOptions = [
  { name: 'oak', image: OakImage, color: '#2e8b57' },
  { name: 'pine', image: PineImage, color: '#32cd32' },
  { name: 'cedar', image: CedarImage, color: '#228b22' },
  { name: 'birch', image: BirchImage, color: '#006400' },
  { name: 'maple', image: MapleImage, color: '#7fff00' }
];

const ImpactDetails = ({ route }) => {
  const { polygon, markers = [], biodiversityPercent = 0.75, coveragePercent = 0.6, recoveryPercent = 0.85 } = route.params;
  const [localMarkers, setLocalMarkers] = useState(markers);
  const [selectedPlant, setSelectedPlant] = useState('oak');
  const [loading, setLoading] = useState(false);
  const [overlayImageURL, setOverlayImageURL] = useState(null);
  const [section, setSection] = useState('Current');
  const [versions, setVersions] = useState([]);
  const navigation = useNavigation();
  const [coverage, setCoverage] = useState(0);
  const [biodiversity, setBiodiversity] = useState(0);
  const [recovery, setRecovery] = useState(0);

  const polygonString = JSON.stringify(polygon);
  const polygonHash = createChecksum(polygonString);
  const storageKey = `savedVersions_${polygonHash}`;

  useEffect(() => {
    const loadVersions = async () => {
      try {
        const storedVersions = await AsyncStorage.getItem(storageKey);
        if (storedVersions) {
          const parsedVersions = JSON.parse(storedVersions);
          const sortedVersions = parsedVersions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setVersions(sortedVersions);

          if (section === 'Current' && sortedVersions.length > 0) {
            setLocalMarkers(sortedVersions[0].markers);
          }
        } else {
          setVersions([]);
        }
      } catch (error) {
        console.error('Error loading saved versions:', error);
      }
    };
    loadVersions();
  }, [section, storageKey]);

  const fetchHeatmap = async (time) => {
    setLoading(true);
    const markerLocations = localMarkers.map(marker => ({
      latitude: marker.latitude,
      longitude: marker.longitude,
    }));

    try {
      const response = await axios.post('http://192.168.0.152:8000/api/predict_plant_growth/', {
        boundaries: polygon,
        plants: markerLocations,
        save: true,
        time: time,
      });

      setOverlayImageURL(response.data.overlayImageURL);
    } catch (error) {
      console.error('Error fetching overlay:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOverlay = () => {
    if (overlayImageURL) {
      navigation.navigate('BiomassOverlayPage', { polygon, overlayImageURL });
    }
  };

  const handleMapPress = (e) => {
    const newMarker = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      plant: selectedPlant
    };
    setLocalMarkers([...localMarkers, newMarker]);
  };

  const calculateCoverage = () => {
    const outerPolygonArea = calculatePolygonArea(polygon);
    console.log(outerPolygonArea)
    const totalMarkerArea = calculateMarkerArea(localMarkers, 5);
    console.log(totalMarkerArea)
    const coverageValue = Math.max(0, ((totalMarkerArea / outerPolygonArea) * 100).toFixed(2));
    console.log(coverageValue)
    const biodiversityValue = (coverageValue * 0.7).toFixed(2);
    const recoveryValue = (coverageValue * 0.65).toFixed(2);
  
    setCoverage(coverageValue);
    setBiodiversity(biodiversityValue);
    setRecovery(recoveryValue);
  };

  const handleMarkerLongPress = (index) => {
    setLocalMarkers(localMarkers.filter((_, i) => i !== index));
  };

  const saveMarkers = async () => {
    try {
      calculateCoverage();  // Update the coverage, biodiversity, and recovery values
  
      const newVersion = {
        timestamp: new Date().toISOString(),
        polygon,
        markers: localMarkers
      };
      
      const storedVersions = JSON.parse(await AsyncStorage.getItem(storageKey)) || [];
      await AsyncStorage.setItem(storageKey, JSON.stringify([...storedVersions, newVersion]));
      
      Alert.alert('Success', 'Markers and version saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save markers.');
      console.error('Error saving markers:', error);
    }
  };

  const Labels = ({ x, y, bandwidth, data }) => (
    data.map((value, index) => (
      <SvgText
        key={index}
        x={x(index) + bandwidth / 2}
        y={y(value) - 10}
        fontSize={14}
        fill="black"
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        {value}
      </SvgText>
    ))
  );

  const markerCount = countMarkersByColor(localMarkers);
  const data = [markerCount.oak, markerCount.pine, markerCount.cedar, markerCount.birch, markerCount.maple];
  const labels = ['Oak', 'Pine', 'Cedar', 'Birch', 'Maple'];

  const renderContent = () => {
    if (section === 'Current') {
      return (
        <>
          <View style={{ height: 400 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: polygon[0].latitude,
                longitude: polygon[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
            >
              <Polygon coordinates={polygon} fillColor="rgba(0, 0, 255, 0.3)" strokeColor="rgba(0, 0, 255, 0.5)" />
              {localMarkers.map((marker, index) => (
                <>
                  <Marker 
                    key={index}
                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    pinColor={getMarkerColor(marker.plant)}
                    onLongPress={() => handleMarkerLongPress(index)}
                  />
                  <Circle 
                    center={{ latitude: marker.latitude, longitude: marker.longitude }}
                    radius={5}
                    fillColor="rgba(46, 139, 87, 0.6)"
                  />
                </>
              ))}
            </MapView>
          </View>
          <View style={[tw`absolute right-4 top-24`, { flexDirection: 'column' }]}>
              {plantOptions.map((plant, index) => (
                <TouchableOpacity
                  key={index}
                  style={[tw`mb-4 rounded-full`, { borderColor: plant.color, borderWidth: 3, width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }]}
                  onPress={() => setSelectedPlant(plant.name)}
                >
                  <Image source={plant.image} style={{ width: 40, height: 50, borderRadius: 20 }} />
                </TouchableOpacity>
              ))}
          </View>
          <View style={tw`p-4`}>
            <View style={tw`flex-row justify-between mb-4`}>
              <View style={tw`items-center`}>
                <Progress.Circle size={64} progress={biodiversity / 100} showsText={true} color={'#4caf50'} />
                <Text style={tw`mt-2`}>Biodiversity</Text>
              </View>
              <View style={tw`items-center`}>
                <Progress.Circle size={64} progress={coverage / 100} showsText={true} color={'#2196f3'} />
                <Text style={tw`mt-2`}>Coverage</Text>
              </View>
              <View style={tw`items-center`}>
                <Progress.Circle size={64} progress={recovery / 100} showsText={true} color={'#ffc107'} />
                <Text style={tw`mt-2`}>Recovery</Text>
              </View>
            </View>

            <Text style={tw`text-lg font-bold mb-2`}>Marker Breakdown</Text>
            <BarChart
              style={{ height: 200 }}
              data={data}
              svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
              contentInset={{ top: 30, bottom: 30 }}
              spacingInner={0.2}
              yMin={0}
            >
              <Grid />
              <Labels />
            </BarChart>
            <View style={tw`flex-row justify-around mt-2`}>
              {labels.map((label, idx) => (
                <Text key={idx}>{label}</Text>
              ))}
            </View>
          </View>

          <View style={tw`p-6`}>
            {/* Save Markers Button */}
            <TouchableOpacity
              style={[tw`p-4 bg-blue-500 rounded-md`, { justifyContent: 'center', alignItems: 'center' }]}
              onPress={saveMarkers}
            >
              <Text style={tw`text-white text-lg`}>Save Markers</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {/* Predict Heatmap for 10 Days */}
              <TouchableOpacity
                style={[tw`p-4 bg-green-500 rounded-md mt-4`, { justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => fetchHeatmap(10)}
              >
                <Text style={tw`text-white text-lg`}>Predict Heatmap for 10 Days</Text>
              </TouchableOpacity>

              {/* Predict Heatmap for 30 Days */}
              <TouchableOpacity
                style={[tw`p-4 bg-green-500 rounded-md mt-4`, { justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => fetchHeatmap(30)}
              >
                <Text style={tw`text-white text-lg`}>Predict Heatmap for 30 Days</Text>
              </TouchableOpacity>

              {/* Predict Heatmap for 50 Days */}
              <TouchableOpacity
                style={[tw`p-4 bg-green-500 rounded-md mt-4`, { justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => fetchHeatmap(50)}
              >
                <Text style={tw`text-white text-lg`}>Predict Heatmap for 50 Days</Text>
              </TouchableOpacity>
            </>
          )}

          {overlayImageURL && (
            <TouchableOpacity
              style={[tw`p-4 bg-purple-500 rounded-md mt-4`, { justifyContent: 'center', alignItems: 'center' }]}
              onPress={handleViewOverlay}
            >
              <Text style={tw`text-white text-lg`}>View Overlayed Heatmap</Text>
            </TouchableOpacity>
          )}
        </>
      );
    } else if (section === 'Versions') {
      return (
        <FlatList
          data={versions}
          keyExtractor={(item) => item.timestamp}
          renderItem={({ item }) => {
            const markerCounts = countMarkersByColor(item.markers);
            const totalMarkers = item.markers.length;

            return (
              <TouchableOpacity
                style={tw`bg-white shadow-lg rounded-lg mb-8 w-full h-128`}
                onPress={() => {
                  setLocalMarkers(item.markers);
                }}
              >
                <Text style={tw`text-xl font-bold text-center mb-6`}>Version from {new Date(item.timestamp).toLocaleString()}</Text>
                
                <MapView
                  style={tw`w-full h-3/4`}
                  initialRegion={{
                    latitude: item.polygon[0].latitude,
                    longitude: item.polygon[0].longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Polygon coordinates={item.polygon} fillColor="rgba(0, 0, 255, 0.3)" strokeColor="rgba(0, 0, 255, 0.5)" />
                  {item.markers.map((marker, index) => (
                    <>
                      <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        pinColor={getMarkerColor(marker.plant)}
                      />
                      <Circle 
                        center={{ latitude: marker.latitude, longitude: marker.longitude }}
                        radius={10}
                        fillColor="rgba(46, 139, 87, 0.6)" 
                      />
                    </>
                  ))}
                </MapView>

                <View style={tw`p-4`}>
                  <Text>Total Plants: {totalMarkers}</Text>
                  <Text>Oak: {markerCounts.oak}, Pine: {markerCounts.pine}, Cedar: {markerCounts.cedar}, Birch: {markerCounts.birch}, Maple: {markerCounts.maple}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No versions have been saved yet.</Text>}
        />
      );
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row justify-between p-4`}>
        <TouchableOpacity
          style={[tw`flex-1 p-2 rounded mr-2`, { backgroundColor: section === 'Current' ? 'green' : 'gray' }]}
          onPress={() => setSection('Current')}
        >
          <Text style={tw`text-white text-center`}>Current</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tw`flex-1 p-2 rounded ml-2`, { backgroundColor: section === 'Versions' ? 'green' : 'gray' }]}
          onPress={() => setSection('Versions')}
        >
          <Text style={tw`text-white text-center`}>Versions</Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </ScrollView>
  );
};

export default ImpactDetails;
