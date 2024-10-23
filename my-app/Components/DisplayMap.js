import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import tw from 'twrnc';

const DisplayMap = ({ polygon = [], markers = [], mapHeight = "200px" }) => {
  const mapRef = useRef(null);

  // Use effect to fit polygon on map load
  useEffect(() => {
    if (polygon.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(polygon, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [polygon]);

  // Function to calculate the center of the polygon (if needed)
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

  // Calculate the center of the polygon
  const initialCenter = calculateCenter(polygon);

  return (
    <View style={[tw`flex-1`, { height: mapHeight }]}>
      {polygon.length > 0 || markers.length > 0 ? (
        <MapView
          ref={mapRef}
          style={tw`flex-1`}
          initialRegion={{
            latitude: initialCenter.latitude,
            longitude: initialCenter.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          {/* Render polygon */}
          {polygon.length > 0 && (
            <Polygon
              coordinates={polygon}
              fillColor="rgba(0, 0, 255, 0.3)"
              strokeColor="rgba(0, 0, 255, 0.5)"
            />
          )}

          {/* Render markers with their plant type (color) */}
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              coordinate={marker} 
              pinColor={marker.plant} // Display the marker color based on the plant type
            />
          ))}
        </MapView>
      ) : (
        <Text style={tw`text-center text-gray-500 p-4`}>
          No polygon or markers to display.
        </Text>
      )}
    </View>
  );
};

export default DisplayMap;
