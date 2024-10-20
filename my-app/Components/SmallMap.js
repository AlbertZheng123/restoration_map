import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import tw from 'twrnc';

export default function SmallMap({ route, savedPolygon = [], plantMarkers = [], isViewOnly = false, mapHeight = "400px" }) {
  // Safely extract parameters from route (if route exists)
  const polygonData = route?.params?.savedPolygon || savedPolygon;
  const markerData = route?.params?.plantMarkers || plantMarkers;

  // Log the received polygon and markers
  console.log("Rendering SmallMap with Polygon: ", polygonData);
  console.log("Rendering SmallMap with Markers: ", markerData);

  // Calculate the center of the polygon for map centering
  const calculateCenter = (coordinates) => {
    if (coordinates.length === 0) return { latitude: 37.78825, longitude: -122.4324 }; // Default location
    let latSum = 0, lngSum = 0;
    coordinates.forEach(coord => {
      latSum += coord.latitude;
      lngSum += coord.longitude;
    });
    return {
      latitude: latSum / coordinates.length,
      longitude: lngSum / coordinates.length,
    };
  };

  // Set the initial region based on the center of the polygon
  const initialRegion = polygonData.length > 0 ? {
    ...calculateCenter(polygonData),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={[tw`flex-1`, { height: mapHeight }]}>
      {polygonData.length > 0 || markerData.length > 0 ? (
        <MapView
          style={tw`flex-1`}
          initialRegion={initialRegion}
          scrollEnabled={!isViewOnly}
          zoomEnabled={!isViewOnly}
        >
          {/* Render polygon if available */}
          {polygonData.length > 0 && (
            <Polygon
              coordinates={polygonData}
              fillColor="rgba(0, 0, 255, 0.3)"
              strokeColor="rgba(0, 0, 255, 0.5)"
            />
          )}

          {/* Render markers if available */}
          {markerData.map((marker, index) => (
            <Marker key={index} coordinate={marker} />
          ))}
        </MapView>
      ) : (
        <Text style={tw`text-center text-gray-500 p-4`}>
          No polygon or markers to display.
        </Text>
      )}
    </View>
  )
}