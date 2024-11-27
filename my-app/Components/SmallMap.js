import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Alert, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

// Import plant images
import OakImage from '../assets/oakplant.png';
import PineImage from '../assets/pineplant.png';
import CedarImage from '../assets/cedarplant.png';
import BirchImage from '../assets/birchplant.png';
import MapleImage from '../assets/mapleplant.png';

// Define shades of green for markers
const plantColors = {
  oak: '#2e8b57',    // Dark Green
  pine: '#32cd32',   // Lime Green
  cedar: '#228b22',  // Forest Green
  birch: '#006400',  // Darker Green
  maple: '#7fff00',  // Chartreuse
};

export default function SmallMap({ route, savedPolygon = [] }) {
  const navigation = useNavigation();
  const [localPlantMarkers, setLocalPlantMarkers] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState({ name: 'oak' }); // Default to Oak plant
  const polygonData = route?.params?.savedPolygon || savedPolygon;
  const uniqueKey = 'savedVersions_' + Date.now(); // Generate a unique key

  // Plant options with corresponding images and types
  const plantOptions = [
    { image: OakImage, name: 'oak' },
    { image: PineImage, name: 'pine' },
    { image: CedarImage, name: 'cedar' },
    { image: BirchImage, name: 'birch' },
    { image: MapleImage, name: 'maple' }
  ];

  // Check for first-time save and initialize AsyncStorage
  useEffect(() => {
    const initializePolygonData = async () => {
      try {
        const storedVersions = JSON.parse(await AsyncStorage.getItem(uniqueKey)) || [];
        if (storedVersions.length === 0 && polygonData.length > 0) {
          // Save the first polygon as the initial version
          const initialVersion = { polygon: polygonData, markers: [], timestamp: new Date().toISOString() };
          await AsyncStorage.setItem(uniqueKey, JSON.stringify([initialVersion]));
          console.log('Initial version saved:', initialVersion);
        } else {
          console.log('Existing versions found:', storedVersions);
        }
      } catch (error) {
        console.error('Error initializing polygon data:', error);
      }
    };
    initializePolygonData();
  }, [polygonData, uniqueKey]);
  

  // Handle map press to add a new marker
  const handleMapPress = (e) => {
    const newMarker = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      plant: selectedPlant.name  // Store plant type (oak, pine, etc.)
    };
    setLocalPlantMarkers([...localPlantMarkers, newMarker]);
  };

  // Handle saving the markers to AsyncStorage as a version
  const handleSaveMarkers = async () => {
    try {
      const newVersion = {
        polygon: polygonData,
        markers: localPlantMarkers,
        timestamp: new Date().toISOString(),
      };
  
      const storedVersions = JSON.parse(await AsyncStorage.getItem(uniqueKey)) || [];
      const updatedVersions = [...storedVersions, newVersion];
      await AsyncStorage.setItem(uniqueKey, JSON.stringify(updatedVersions));
  
      console.log("Markers saved:", localPlantMarkers);
      navigation.navigate('Impact', { savedPolygon: polygonData, markers: localPlantMarkers });
    } catch (error) {
      Alert.alert('Error', 'Failed to save markers.');
      console.error("Error saving markers:", error);
    }
  };
  

  return (
    <View style={tw`flex-1`}>
      {/* Render Map */}
      {polygonData.length > 0 ? (
        <MapView
          style={tw`flex-1`}
          initialRegion={{
            latitude: polygonData[0]?.latitude || 37.78825,
            longitude: polygonData[0]?.longitude || -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {/* Render Polygon */}
          {polygonData.length > 0 && (
            <Polygon
              coordinates={polygonData}
              fillColor="rgba(0, 0, 255, 0.3)"
              strokeColor="rgba(0, 0, 255, 0.5)"
            />
          )}

          {/* Render local plant markers as solid shades of green */}
          {localPlantMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              pinColor={plantColors[marker.plant]}  // Use shades of green for marker colors
            />
          ))}
        </MapView>
      ) : (
        <Text style={tw`text-center text-gray-700 p-4`}>
          No polygon or markers to display.
        </Text>
      )}

      {/* Sidebar for selecting plant types */}
      <View style={[tw`absolute right-4 top-16`, { flexDirection: 'column' }]}>
        {plantOptions.map((plant, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.plantSelection, { borderColor: plantColors[plant.name] }]}  // Use corresponding green shade as border color
            onPress={() => setSelectedPlant(plant)}
          >
            <Image source={plant.image} style={styles.plantImage} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Save Markers Button */}
      <TouchableOpacity
        onPress={handleSaveMarkers}
        style={tw`bg-green-700 p-3 rounded-full absolute bottom-8 left-4 right-4`}
      >
        <Text style={tw`text-white text-center`}>Save Markers</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  plantSelection: {
    marginBottom: 12,
    borderRadius: 50,
    borderWidth: 2,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantImage: {
    width: 44,  // Slightly smaller to fit within the border
    height: 44,
    borderRadius: 22,
  },
});
