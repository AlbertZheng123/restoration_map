import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, FlatList, Modal, TextInput } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { BarChart, Grid } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';

// Helper function to calculate the area of a polygon using the Shoelace Theorem
const calculatePolygonArea = (coordinates) => {
  if (coordinates.length < 3) return 0; // Less than 3 points is not a valid polygon

  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const { latitude: x1, longitude: y1 } = coordinates[i];
    const { latitude: x2, longitude: y2 } = coordinates[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);  // Return absolute value and divide by 2
};

const InnerPolygonDetails = ({ route, navigation }) => {
  const { mainPolygon, innerPolygons } = route.params;
  const [localInnerPolygons, setLocalInnerPolygons] = useState(innerPolygons || []);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);  // For handling selected polygon
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [plantCount, setPlantCount] = useState('');
  const [plantType, setPlantType] = useState('');
  const [section, setSection] = useState('Current');
  const [isMappingMode, setIsMappingMode] = useState(false);  // Mapping mode state
  const [versions, setVersions] = useState([]);
  const [coveragePercentage, setCoveragePercentage] = useState(0);  // To store coverage percentage

  useEffect(() => {
    const loadLatestVersion = async () => {
      try {
        const storedVersions = await AsyncStorage.getItem('innerPolygonVersions');
        if (storedVersions) {
          const parsedVersions = JSON.parse(storedVersions);
          const safeParsedVersions = Array.isArray(parsedVersions) ? parsedVersions : [];
          const sortedVersions = safeParsedVersions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          if (sortedVersions.length > 0 && section === 'Current') {
            setLocalInnerPolygons(sortedVersions[0].innerPolygons);
          }
          setVersions(sortedVersions);
        } else {
          setLocalInnerPolygons(innerPolygons);
        }
      } catch (error) {
        console.error('Error loading versions:', error);
      }
    };

    loadLatestVersion();
  }, [section]);

  useEffect(() => {
    calculateCoverage();
  }, [localInnerPolygons]);

  const calculateCoverage = () => {
    const outerPolygonArea = calculatePolygonArea(mainPolygon);
    console.log(outerPolygonArea)
    const innerPolygonsArea = localInnerPolygons.reduce((total, polygon) => {
      return total + calculatePolygonArea(polygon.coords);
    }, 0);

    const coverage = ((innerPolygonsArea / outerPolygonArea) * 100).toFixed(2);  // Calculate percentage and round to 2 decimals
    setCoveragePercentage(coverage);
  };

  // Helper to compute darker shades of green based on plant count
  const getPolygonColor = (plantCount) => {
    const baseColor = 50;  // Base green intensity
    const intensity = Math.min(255, baseColor + (Math.floor(plantCount / 20) * 50));  // Darker shade for every 20 plants
    return `rgba(0, ${intensity}, 0, 0.6)`;  // Adjust the green value dynamically
  };

  const calculateBoundingBox = (coordinates) => {
    const latitudes = coordinates.map(point => point.latitude);
    const longitudes = coordinates.map(point => point.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.min(...longitudes);

    const latDelta = maxLat - minLat;
    const lngDelta = maxLng - minLng;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta + 0.01,
      longitudeDelta: lngDelta + 0.01,
    };
  };

  const handlePolygonPress = (polygon) => {
    if (!isMappingMode) {
      setSelectedPolygon(polygon);  // Set selected polygon to display details
    }
  };

  const handleMapPress = (e) => {
    if (isMappingMode) {
      const newCoord = {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      };
      setCurrentPolygon((prevCoords) => [...prevCoords, newCoord]);
    }
  };

  const handleInnerPolygonCreation = () => {
    if (currentPolygon.length >= 3) {
      setIsModalVisible(true);  // Show the modal for plant count and type input
    } else {
      Alert.alert('Error', 'An inner polygon requires at least 3 points.');
    }
  };

  const saveInnerPolygonData = () => {
    const newInnerPolygon = {
      id: `inner-polygon-${localInnerPolygons.length + 1}`,
      coords: currentPolygon,
      plants: parseInt(plantCount, 10) || 0,
      plantType: plantType || 'Unknown',
    };

    setLocalInnerPolygons((prevPolygons) => [...prevPolygons, newInnerPolygon]);
    setCurrentPolygon([]);  // Reset the current polygon drawing
    setIsModalVisible(false);  // Hide the modal
    setIsMappingMode(false);  // Exit mapping mode after saving the polygon
  };

  const toggleMappingMode = () => {
    setIsMappingMode((prevMode) => !prevMode);  // Toggle between mapping mode and normal mode
    setCurrentPolygon([]);  // Clear any current polygon when switching modes
  };

  const saveVersion = async () => {
    try {
      const newVersion = {
        timestamp: new Date().toISOString(),
        innerPolygons: localInnerPolygons,
        coveragePercentage, // Save coverage percentage
      };
      const storedVersions = JSON.parse(await AsyncStorage.getItem('innerPolygonVersions')) || [];
      await AsyncStorage.setItem('innerPolygonVersions', JSON.stringify([...storedVersions, newVersion]));
      Alert.alert('Success', 'Version saved successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the version.');
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

  const combinedPlantData = localInnerPolygons.reduce((acc, polygon) => {
    const { plantType, plants } = polygon;
    if (acc[plantType]) {
      acc[plantType] += plants;
    } else {
      acc[plantType] = plants;
    }
    return acc;
  }, {});

  const plantTypes = Object.keys(combinedPlantData);
  const plantData = Object.values(combinedPlantData);

  const renderStatistics = () => {
    if (localInnerPolygons.length === 0) {
      return <Text style={tw`text-center text-gray-500`}>No polygons to display.</Text>;
    }

    return (
      <View style={tw`p-4`}>
        <Text style={tw`text-lg font-bold mb-2`}>Number of Plants per Polygon</Text>
        <BarChart
          style={{ height: 200 }}
          data={plantData}
          svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
          contentInset={{ top: 30, bottom: 30 }}
          spacingInner={0.2}
          yMin={0}
        >
          <Grid />
          <Labels />
        </BarChart>
        <View style={tw`flex-row justify-around mt-2`}>
          {plantTypes.map((type, idx) => (
            <Text key={idx}>{type}</Text>
          ))}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (section === 'Current') {
      return (
        <ScrollView style={tw`flex-1`}>
          <View style={tw`flex-1`}>
            <MapView
              style={{ height: 450 }}
              initialRegion={calculateBoundingBox(mainPolygon)}
              onPress={handleMapPress}
            >
              <Polygon coordinates={mainPolygon} fillColor="rgba(0, 0, 255, 0.3)" strokeColor="rgba(0, 0, 255, 0.5)" />
              {localInnerPolygons.map((polygon, index) => (
                <Polygon
                  key={index}
                  coordinates={polygon.coords}
                  fillColor={getPolygonColor(polygon.plants)}
                  strokeColor="rgba(0, 255, 0, 0.5)"
                  tappable={true}
                  onPress={() => handlePolygonPress(polygon)}
                />
              ))}
              {currentPolygon.length > 0 && (
                <Polygon coordinates={currentPolygon} fillColor="rgba(255, 0, 0, 0.3)" strokeColor="rgba(255, 0, 0, 0.5)" />
              )}
            </MapView>

            {/* Custom info box in top left corner */}
            {selectedPolygon && (
              <View style={[tw`absolute top-5 left-5 bg-white p-2 rounded-lg shadow-lg`, { zIndex: 1 }]}>
                <Text style={tw`text-base font-bold`}>Plant Type: {selectedPolygon.plantType || 'Unknown'}</Text>
                <Text style={tw`text-base`}>Number of Plants: {selectedPolygon.plants}</Text>
              </View>
            )}
          </View>

          <View style={tw`flex-row justify-between p-4 mt-6`}>
            <TouchableOpacity onPress={handleInnerPolygonCreation} style={tw`bg-green-600 p-3 rounded w-1/3 mr-2`}>
              <Text style={tw`text-white text-center`}>Save Inner Polygon</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={saveVersion} style={tw`bg-blue-600 p-3 rounded w-1/3 ml-2`}>
              <Text style={tw`text-white text-center`}>Save Version</Text>
            </TouchableOpacity>

            {/* New button for starting/stopping mapping mode */}
            <TouchableOpacity onPress={toggleMappingMode} style={tw`bg-yellow-600 p-3 rounded w-1/3 ml-2`}>
              <Text style={tw`text-white text-center`}>{isMappingMode ? 'Cancel Mapping' : 'Start Mapping'}</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`p-6 mt-6`}>
            {renderStatistics()}
            {/* Display coverage percentage */}
            <Text style={tw`text-lg font-bold mt-4`}>Coverage: {coveragePercentage}%</Text>
          </View>
        </ScrollView>
      );
    } else if (section === 'Versions') {
      return (
        <FlatList
    data={versions}
    keyExtractor={(item) => item.timestamp}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={tw`bg-white shadow-lg rounded-lg mb-8 w-full`}
        onPress={() => setLocalInnerPolygons(item.innerPolygons)}
      >
        <Text style={tw`text-xl font-bold text-center mb-6`}>Version from {new Date(item.timestamp).toLocaleString()}</Text>
        <MapView
          style={tw`h-64`} // Adjusted the height for better viewing of text below
          initialRegion={calculateBoundingBox(mainPolygon)}
        >
          <Polygon coordinates={mainPolygon} fillColor="rgba(0, 0, 255, 0.3)" strokeColor="rgba(0, 0, 255, 0.5)" />
          {item.innerPolygons.map((polygon, index) => (
            <Polygon key={index} coordinates={polygon.coords} fillColor="rgba(0, 255, 0, 0.3)" strokeColor="rgba(0, 255, 0, 0.5)" />
          ))}
        </MapView>

        <View style={tw`p-4`}>
          {item.innerPolygons.map((polygon, index) => (
            <Text key={index} style={tw`text-base`}>
              {polygon.plantType}: {polygon.plants || 'N/A'} plants
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    )}
    ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No versions have been saved yet.</Text>}
  />
      );
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
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

      {/* Modal for inputting plant data */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-4 rounded-lg w-80`}>
            <Text style={tw`text-lg font-bold mb-4`}>Enter Plant Information</Text>
            <TextInput
              style={tw`border border-gray-300 p-2 mb-4`}
              placeholder="Plant Type"
              value={plantType}
              onChangeText={setPlantType}
            />
            <TextInput
              style={tw`border border-gray-300 p-2 mb-4`}
              placeholder="Number of Plants"
              value={plantCount}
              onChangeText={setPlantCount}
              keyboardType="numeric"
            />
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={tw`bg-red-500 p-3 rounded w-1/2 mr-2`}>
                <Text style={tw`text-white text-center`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveInnerPolygonData} style={tw`bg-green-600 p-3 rounded w-1/2 ml-2`}>
                <Text style={tw`text-white text-center`}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InnerPolygonDetails;
