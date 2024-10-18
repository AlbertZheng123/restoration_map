import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import tw from 'twrnc';

export default function MapComponent() {
  const [location, setLocation] = useState(null);
  const [markerCoords, setMarkerCoords] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleMapPress = (e) => {
    const newMarker = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };
    setMarkerCoords([...markerCoords, newMarker]);
  };

  const handleSavePolygon = () => {
    if (markerCoords.length >= 3) {
      Alert.alert("Polygon Saved", "Polygon has been saved with the current markers.");
    } else {
      Alert.alert("Polygon Error", "A polygon requires at least three points.");
    }
  };

  const clearMarkers = () => {
    setMarkerCoords([]);
  };

  if (!location) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Waiting for location...</Text>
        {errorMsg && <Text>{errorMsg}</Text>}
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      <MapView
        style={tw`w-full h-full`}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {markerCoords.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
        {markerCoords.length >= 3 && (
          <Polygon
            coordinates={markerCoords}
            fillColor="rgba(100, 100, 200, 0.3)"
            strokeColor="rgba(0, 0, 255, 0.5)"
          />
        )}
      </MapView>
      <View style={tw`absolute bottom-0 left-0 right-0 p-4 bg-white`}>
        <View style={tw`flex-row justify-around`}>
          <TouchableOpacity onPress={handleSavePolygon} style={tw`bg-blue-600 p-2 rounded`}>
            <Text style={tw`text-white text-center`}>Save Polygon</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearMarkers} style={tw`bg-red-600 p-2 rounded`}>
            <Text style={tw`text-white text-center`}>Clear Markers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
