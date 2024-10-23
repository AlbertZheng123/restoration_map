import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import tw from 'twrnc';

const InnerPolygonDetails = ({ route }) => {
  const { mainPolygon, innerPolygons } = route.params; // Receiving data from navigation

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1`}>
        <MapView
          style={tw`w-full h-2/3`} // Larger map
          initialRegion={{
            latitude: mainPolygon[0].latitude,
            longitude: mainPolygon[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Display the main polygon */}
          <Polygon coordinates={mainPolygon} fillColor="rgba(0, 0, 255, 0.3)" strokeColor="rgba(0, 0, 255, 0.5)" />
          
          {/* Display the inner polygons */}
          {innerPolygons.map((polygon, index) => (
            <Polygon
              key={index}
              coordinates={polygon.coords}
              fillColor="rgba(0, 255, 0, 0.3)" // Inner polygon color
              strokeColor="rgba(0, 255, 0, 0.5)"
            />
          ))}
        </MapView>
      </View>

      {/* Statistics Section */}
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-center mb-4`}>Inner Polygon Impact Statistics</Text>
        {innerPolygons.map((polygon, index) => (
          <View key={index} style={tw`mb-4`}>
            <Text style={tw`text-lg`}>Polygon {index + 1}</Text>
            <Text style={tw`text-base`}>Plant Type: {polygon.plantType || 'Unknown'}</Text>
            <Text style={tw`text-base`}>Number of Plants: {polygon.plants || 'N/A'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default InnerPolygonDetails;
