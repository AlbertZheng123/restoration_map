import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for saving data
import * as Location from 'expo-location';  // Use Expo's Location API
import 'react-native-get-random-values';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'; // Google Places API

const GOOGLE_PLACES_API_KEY = 'AIzaSyCXyil6jIoynK_gGJPNNrOFJttzVWFOKYU'; // Replace with your Google Places API key

export default function MapComponent() {
  const [markerCoords, setMarkerCoords] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigation = useNavigation();
  const mapRef = useRef(null); // Reference to the MapView

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

  // Save the polygon
  const handleSavePolygon = async () => {
    if (markerCoords.length >= 3) {
      console.log("Saving polygon data: ", markerCoords);

      try {
        const savedData = {
          polygon: markerCoords, // Save markerCoords as the polygon
          markers: [], // Empty for now; plant markers will be added in SmallMap.js
        };
        const storedPolygons = JSON.parse(await AsyncStorage.getItem('savedPolygons')) || [];
        const updatedPolygons = [...storedPolygons, savedData];
        await AsyncStorage.setItem('savedPolygons', JSON.stringify(updatedPolygons));
        
        // Navigate to SmallMap, passing only the polygon data
        navigation.navigate('SmallMap', { savedPolygon: markerCoords });
      } catch (error) {
        Alert.alert('Error', 'Failed to save the polygon.');
        console.error("Error saving to AsyncStorage: ", error);
      }
    } else {
      Alert.alert('Error', 'A polygon requires at least 3 points.');
    }
  };

  // Save the main polygon and proceed to the inner polygon functionality
  const handleSaveInnerPolygon = async () => {
    if (markerCoords.length >= 3) {
      console.log("Saving polygon data for inner polygons: ", markerCoords);

      try {
        const savedData = {
          polygon: markerCoords,
          markers: [], // Empty for now; inner polygons will be added
        };
        const storedPolygons = JSON.parse(await AsyncStorage.getItem('savedPolygons')) || [];
        const updatedPolygons = [...storedPolygons, savedData];
        await AsyncStorage.setItem('savedPolygons', JSON.stringify(updatedPolygons));

        // Navigate to the InnerPolygonMap for inner polygon creation
        navigation.navigate('InnerPolygonMap', { savedPolygon: markerCoords });
      } catch (error) {
        Alert.alert('Error', 'Failed to save the main polygon for inner polygons.');
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

  const handleLocationSearch = (details) => {
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;

    // Move map to the selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000); // Animation duration
    }
  };

  return (
    <View style={tw`flex-1`}>
      {/* Google Places Search Bar */}
      <View style={{ position: 'absolute', top: 60, zIndex: 1, width: Dimensions.get('window').width }}>
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          fetchDetails={true}
          onPress={(data, details = null) => handleLocationSearch(details)} // 'details' provides the lat/lng
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
          }}
          enablePoweredByContainer={false} // Hide "Powered by Google"
          styles={{
            textInputContainer: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              paddingHorizontal: 10,
            },
            textInput: {
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
              borderRadius: 15,
              backgroundColor: '#f0f0f0',
              paddingLeft: 15,
              paddingRight: 15,
              elevation: 1
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />
      </View>

      <MapView
        ref={mapRef} // Reference to the map
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
          {/* Save Polygon Button */}
          <TouchableOpacity onPress={handleSavePolygon} style={tw`bg-green-500 p-4 rounded flex-1 mr-2 mb-20`}>
            <Text style={tw`text-white text-center`}>Save Polygon</Text>
          </TouchableOpacity>

          {/* Save Inner Polygon Button */}
          <TouchableOpacity onPress={handleSaveInnerPolygon} style={tw`bg-green-600 p-4 rounded flex-1 ml-2 mb-20 `}>
            <Text style={tw`text-white text-center`}>Save Inner Polygon</Text>
          </TouchableOpacity>

          {/* Clear Markers Button */}
          <TouchableOpacity onPress={clearMarkers} style={tw`bg-black p-4 rounded flex-1 ml-2 mb-20`}>
            <Text style={tw`text-white text-center`}>Clear Markers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

