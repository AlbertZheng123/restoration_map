import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import tw from 'twrnc';

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

    // Log markers received by DisplayMap
    console.log('Markers received by DisplayMap:', JSON.stringify(markers, null, 2));
  }, [polygon, markers]);

  if (markers.length === 0) {
    return <Text style={tw`text-center text-gray-500 p-4`}>No markers to display</Text>;
  }

  return (
    <View style={[tw`flex-1`, { height: mapHeight }]}>
      {polygon.length > 0 || markers.length > 0 ? (
        <MapView
          ref={mapRef}
          style={tw`flex-1`}
          initialRegion={{
            latitude: polygon.length ? polygon[0].latitude : 37.78825,
            longitude: polygon.length ? polygon[0].longitude : -122.4324,
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
              pinColor={getMarkerColor(marker.plant)} // Use green shades based on plant type
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
