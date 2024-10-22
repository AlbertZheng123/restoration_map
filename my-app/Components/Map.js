import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for saving data
import * as Location from 'expo-location';  // Use Expo's Location API

export default function MapComponent() {
  const [markerCoords, setMarkerCoords] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigation = useNavigation();

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to use the map.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setCurrentLocation({ latitude, longitude });
  };

  useEffect(() => {
    getCurrentLocation();  // Fetch user's location when the component mounts
  }, []);

  const handleMapPress = (e) => {
    const newMarker = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };
    setMarkerCoords([...markerCoords, newMarker]);
  };

  const handleSavePolygon = async () => {
    if (markerCoords.length >= 3) {
      // Log the current polygon data to verify it's correct
      console.log("Saving polygon data: ", markerCoords);
  
      try {
        const savedData = {
          polygon: markerCoords,
          markers: markerCoords,
        };
        // Retrieve any existing polygons
        const storedPolygons = JSON.parse(await AsyncStorage.getItem('savedPolygons')) || [];
        
        // Log existing polygons before saving new data
        console.log("Existing polygons in AsyncStorage: ", storedPolygons);
        
        const updatedPolygons = [...storedPolygons, savedData];
        
        // Save the updated polygon list to AsyncStorage
        await AsyncStorage.setItem('savedPolygons', JSON.stringify(updatedPolygons));
        
        console.log("Updated polygons saved to AsyncStorage: ", updatedPolygons);
        
        // Navigate to SmallMap and pass the savedPolygon and markers
        navigation.navigate('SmallMap', { savedPolygon: markerCoords, plantMarkers: markerCoords });
      } catch (error) {
        Alert.alert('Error', 'Failed to save the polygon.');
        console.error("Error saving to AsyncStorage: ", error);
      }
    } else {
      Alert.alert('Error', 'A polygon requires at least 3 points.');
    }
  };
  
  const clearMarkers = () => {
    setMarkerCoords([]);
  };

  const defaultRegion = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 37.78825,  // Default fallback location (San Francisco)
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
    <View style={tw`flex-1`}>
      <MapView
        style={tw`w-full h-full`}
        initialRegion={defaultRegion}
        onPress={handleMapPress}
        showsUserLocation={true} // Show user's location on the map
      >
        {markerCoords.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
        {markerCoords.length >= 3 && (
          <Polygon coordinates={markerCoords} fillColor="rgba(100, 100, 200, 0.3)" />
        )}
      </MapView>

      <View style={tw`absolute bottom-0 left-0 right-0 p-4`}>
        <View style={tw`flex-row justify-around`}>
          <TouchableOpacity onPress={handleSavePolygon} style={tw`bg-green-500 p-4 rounded-full flex-1 mr-2 mb-20`}>
            <Text style={tw`text-white text-center`}>Save Polygon</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearMarkers} style={tw`bg-black p-4 rounded-full flex-1 ml-2 mb-20`}>
            <Text style={tw`text-white text-center`}>Clear Markers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
