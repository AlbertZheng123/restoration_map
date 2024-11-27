import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, LogBox } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';

LogBox.ignoreLogs(['Warning: ...']);

// Define getMarkerColor function to map plant type to marker color (shades of green)
const getMarkerColor = (plant) => {
  switch (plant) {
    case 'oak': return '#2e8b57'; // Dark Green
    case 'pine': return '#32cd32'; // Lime Green
    case 'cedar': return '#228b22'; // Forest Green
    case 'birch': return '#006400'; // Darker Green
    case 'maple': return '#7fff00'; // Chartreuse
    default: return '#2e8b57'; // Default to dark green
  }
};

// Function to calculate the area of a polygon using the Haversine formula
const calculatePolygonArea = (coordinates) => {
  const RADIUS_EARTH_METERS = 6371000;
  if (coordinates.length < 3) return 0;

  let totalArea = 0;
  const numPoints = coordinates.length;

  for (let i = 0; i < numPoints; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[(i + 1) % numPoints];
    const lat1 = (p1.latitude * Math.PI) / 180;
    const lat2 = (p2.latitude * Math.PI) / 180;
    const dLong = ((p2.longitude - p1.longitude) * Math.PI) / 180;
    const segmentArea = dLong * (2 + Math.sin(lat1) + Math.sin(lat2));
    totalArea += segmentArea;
  }

  return Math.abs((totalArea * RADIUS_EARTH_METERS * RADIUS_EARTH_METERS) / 2);
};

const calculateCenterLocation = (polygon) => {
  const latitudes = polygon.map(point => point.latitude);
  const longitudes = polygon.map(point => point.longitude);
  const avgLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const avgLongitude = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
  return { latitude: avgLatitude, longitude: avgLongitude };
};

const Impact = () => {
  const [latestVersions, setLatestVersions] = useState([]);
  const navigation = useNavigation();
  const route = useRoute(); // Get route to access passed data from SmallMap.js
  const mapRefs = useRef([]);

  // Check for passed data from SmallMap.js
  const { savedPolygon = null, markers = [] } = route.params || {};

  // Load the latest saved version from AsyncStorage for each set of versions
  useEffect(() => {
    const loadLatestVersions = async () => {
      try {
        if (savedPolygon && markers.length > 0) {
          // If data is passed from SmallMap.js, prioritize that
          const initialVersion = {
            polygon: savedPolygon,
            markers: markers,
            timestamp: new Date().toISOString(),
          };
          setLatestVersions([initialVersion]); // Set as the latest version
        } else {
          // Otherwise, load from AsyncStorage
          const allKeys = await AsyncStorage.getAllKeys();
          const versionKeys = allKeys.filter(key => key.startsWith('savedVersions_'));

          let latestVersionsMap = {};
          for (const key of versionKeys) {
            const storedVersions = await AsyncStorage.getItem(key);
            if (storedVersions) {
              const parsedVersions = JSON.parse(storedVersions);
              const sortedVersions = parsedVersions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
              if (sortedVersions.length > 0) {
                const latestVersion = sortedVersions[0];
                const polygonKey = JSON.stringify(latestVersion.polygon);
                latestVersionsMap[polygonKey] = latestVersion;
              }
            }
          }

          const latestVersionsList = Object.values(latestVersionsMap); 
          setLatestVersions(latestVersionsList); 
        }
      } catch (error) {
        console.error('Failed to load saved versions in Impact.js:', error);
      }
    };

    loadLatestVersions();
  }, [savedPolygon, markers]); // Reload if data from SmallMap.js changes

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setLatestVersions([]);
      Alert.alert('Success', 'All AsyncStorage data has been cleared.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data.');
      console.error('Failed to clear AsyncStorage data:', error);
    }
  };

  const goToImpactDetails = (polygon, markers) => {
    navigation.navigate('ImpactDetails', { polygon, markers });
  };

  if (latestVersions.length === 0) {
    return (
      <View style={tw`flex-1 bg-gray-100 justify-center items-center`}>
        <Text style={tw`text-xl text-gray-500`}>No data available. Add a new version.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-3xl font-bold mb-2 text-center p-12`}>Impact Dashboard</Text>

        <View style={tw`flex-row justify-between w-full mb-8`}>
          <TouchableOpacity onPress={clearAllData} style={tw`bg-red-600 p-2 rounded w-[45%] mr-1`}>
            <Text style={tw`text-white text-center`}>Clear All Data</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('InnerPolygonsSection')} style={tw`bg-green-600 p-2 rounded w-[45%] ml-1`}>
            <Text style={tw`text-white text-center`}>View Inner Polygons Section</Text>
          </TouchableOpacity>
        </View>

        {latestVersions.map((version, index) => {
          const markers = version.markers || [];
          const area = calculatePolygonArea(version.polygon).toFixed(2);
          const centerLocation = calculateCenterLocation(version.polygon);
          const locationText = `Lat: ${centerLocation.latitude.toFixed(2)}, Lon: ${centerLocation.longitude.toFixed(2)}`;

          return (
            <TouchableOpacity
              key={index}
              style={tw`bg-white shadow-lg rounded-lg mb-8 w-full`}
              onPress={() => goToImpactDetails(version.polygon, markers)}
            >
              <Text style={tw`text-xl font-bold text-center mb-6`}>
                Restoration Area {index + 1}
              </Text>

              <View style={{ height: 300 }}>
                <MapView
                  ref={(el) => (mapRefs.current[index] = el)}  
                  style={{ flex: 1 }}
                  onLayout={() => {
                    if (mapRefs.current[index] && version.polygon) {
                      mapRefs.current[index].fitToCoordinates(version.polygon, {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                      });
                    }
                  }}
                  initialRegion={{
                    latitude: version.polygon[0].latitude,
                    longitude: version.polygon[0].longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Polygon
                    coordinates={version.polygon}
                    fillColor="rgba(0, 0, 255, 0.3)"
                    strokeColor="rgba(0, 0, 255, 0.5)"
                  />
                  {markers.map((marker, markerIndex) => (
                    <Marker
                      key={markerIndex}
                      coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                      pinColor={getMarkerColor(marker.plant)}
                    />
                  ))}
                </MapView>
              </View>

              <View style={tw`p-4`}>
                <View style={tw`flex-row justify-between items-center`}>
                  <View style={[tw`p-3 bg-green-500 rounded-md`]}>
                    <Text style={tw`text-white text-sm`}>Area: {area} m²</Text>
                  </View>
                  <View style={[tw`p-3 bg-green-500 rounded-md`]}>
                    <Text style={tw`text-white text-sm`}>{locationText}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Impact;
