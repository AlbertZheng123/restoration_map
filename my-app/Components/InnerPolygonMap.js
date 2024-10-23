import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert, Modal, TextInput } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

export default function InnerPolygonMap({ route, navigation }) {
  const { savedPolygon } = route.params; // Get the main polygon from route params
  const [innerPolygons, setInnerPolygons] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [mapRegion, setMapRegion] = useState(null); // Track the map's initial region
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [plantCount, setPlantCount] = useState('');
  const [plantType, setPlantType] = useState('');

  // Calculate the bounding box of the polygon to zoom in
  const calculateBoundingBox = (coordinates) => {
    const latitudes = coordinates.map(point => point.latitude);
    const longitudes = coordinates.map(point => point.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = maxLat - minLat;
    const lngDelta = maxLng - minLng;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta + 0.01,  // Add a small buffer
      longitudeDelta: lngDelta + 0.01, // Add a small buffer
    };
  };

  // Set the map's region when the saved polygon is loaded
  useEffect(() => {
    if (savedPolygon && savedPolygon.length > 0) {
      const boundingBox = calculateBoundingBox(savedPolygon);
      setMapRegion(boundingBox); // Set map region based on polygon bounding box
    }
  }, [savedPolygon]);

  const handleMapPress = (e) => {
    const newCoord = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };
    setCurrentPolygon((prevCoords) => [...prevCoords, newCoord]);
  };

  const handleInnerPolygonCreation = () => {
    if (currentPolygon.length >= 3) {
      setIsModalVisible(true);  // Show modal to collect input
    } else {
      Alert.alert('Error', 'An inner polygon requires at least 3 points.');
    }
  };

  const saveInnerPolygonData = () => {
    const newInnerPolygon = {
      id: `inner-polygon-${innerPolygons.length + 1}`,
      coords: currentPolygon,
      plants: parseInt(plantCount, 10) || 0,  // Parse and default to 0 if invalid
      plantType: plantType || 'Unknown',      // Default to 'Unknown' if not provided
    };

    setInnerPolygons((prevPolygons) => [...prevPolygons, newInnerPolygon]);
    setCurrentPolygon([]); // Reset after saving
    setIsModalVisible(false); // Close modal after saving
  };

  const saveInnerPolygons = async () => {
    try {
      const storedPolygons = JSON.parse(await AsyncStorage.getItem('savedPolygonData')) || [];
      const newPolygonData = {
        type: 'polygon_with_inner_polygons',
        mainPolygon: savedPolygon, // The outer polygon
        innerPolygons, // Inner polygons data
      };

      await AsyncStorage.setItem('savedPolygonData', JSON.stringify([...storedPolygons, newPolygonData]));

      Alert.alert('Success', 'Inner polygons saved.');
      navigation.navigate('Impact'); // Navigate to Impact page
    } catch (error) {
      Alert.alert('Error', 'Failed to save inner polygon data.');
      console.error('Error saving inner polygon data:', error);
    }
  };

  return (
    <View style={tw`flex-1`}>
      <MapView
        style={tw`flex-1`}
        onPress={handleMapPress}
        initialRegion={mapRegion} // Center the map on the calculated region
      >
        {/* Render the main polygon */}
        {savedPolygon.length > 0 && (
          <Polygon
            coordinates={savedPolygon}
            fillColor="rgba(0, 0, 255, 0.3)"
            strokeColor="rgba(0, 0, 255, 0.5)"
          />
        )}

        {/* Render inner polygons */}
        {innerPolygons.map((polygon, index) => (
          <Polygon
            key={index}
            coordinates={polygon.coords}
            fillColor="rgba(0, 255, 0, 0.3)" // Inner polygon color
            strokeColor="rgba(0, 255, 0, 0.5)"
          />
        ))}

        {/* Render the currently drawn polygon (in-progress polygon) */}
        {currentPolygon.length > 0 && (
          <Polygon
            coordinates={currentPolygon}
            fillColor="rgba(255, 0, 0, 0.3)" // Highlight the current polygon in red
            strokeColor="rgba(255, 0, 0, 0.5)"
          />
        )}
      </MapView>

      {/* Button to Save Current Inner Polygon */}
      <TouchableOpacity onPress={handleInnerPolygonCreation} style={tw`bg-green-600 p-2 rounded absolute bottom-20 left-4`}>
        <Text style={tw`text-white text-center`}>Save Inner Polygon</Text>
      </TouchableOpacity>

      {/* Button to Save All Inner Polygons */}
      <TouchableOpacity onPress={saveInnerPolygons} style={tw`bg-blue-600 p-2 rounded absolute bottom-8 left-4`}>
        <Text style={tw`text-white text-center`}>Save All Inner Polygons</Text>
      </TouchableOpacity>

      {/* Modal for Plant Count and Type */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}  // Close modal on back button press
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-6 rounded-lg w-80`}>
            <Text style={tw`text-xl font-bold mb-4`}>Enter Polygon Details</Text>
            <Text>Number of Plants</Text>
            <TextInput
              style={tw`border p-2 rounded mb-4`}
              keyboardType="numeric"
              value={plantCount}
              onChangeText={(text) => setPlantCount(text)}
              placeholder="Enter number of plants"
            />
            <Text>Plant Type</Text>
            <TextInput
              style={tw`border p-2 rounded mb-4`}
              value={plantType}
              onChangeText={(text) => setPlantType(text)}
              placeholder="Enter plant type"
            />

            <TouchableOpacity onPress={saveInnerPolygonData} style={tw`bg-green-600 p-2 rounded`}>
              <Text style={tw`text-white text-center`}>Save Polygon</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
