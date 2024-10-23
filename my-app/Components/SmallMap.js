// import React, { useState } from 'react';
// import { View, TouchableOpacity, Text, Alert } from 'react-native';
// import MapView, { Marker, Polygon } from 'react-native-maps';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import tw from 'twrnc';

// export default function SmallMap({ route, savedPolygon = [] }) {
//   const navigation = useNavigation();  
//   const [localPlantMarkers, setLocalPlantMarkers] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('red'); // Default to red marker
//   const polygonData = route?.params?.savedPolygon || savedPolygon;

//   // Plant color options
//   const plantColors = [
//     { color: 'red', name: 'Red' },
//     { color: 'yellow', name: 'Yellow' },
//     { color: 'green', name: 'Green' },
//     { color: 'orange', name: 'Orange' },
//     { color: 'blue', name: 'Blue' }
//   ];

//   const handleMapPress = (e) => {
//     const newMarker = {
//       latitude: e.nativeEvent.coordinate.latitude,
//       longitude: e.nativeEvent.coordinate.longitude,
//       plant: selectedPlant // Save the selected plant type (color)
//     };
//     setLocalPlantMarkers([...localPlantMarkers, newMarker]);
//   };

//   const handleSaveMarkers = async () => {
//     try {
//       const storedPolygons = JSON.parse(await AsyncStorage.getItem('savedPolygons')) || [];
//       // Update the last polygon with the new markers
//       const updatedPolygons = storedPolygons.map((item, index) => 
//         index === storedPolygons.length - 1
//           ? { ...item, markers: localPlantMarkers }  // Save plant markers here
//           : item
//       );
      
//       await AsyncStorage.setItem('savedPolygons', JSON.stringify(updatedPolygons));
//       console.log('Updated polygon with markers: ', updatedPolygons);
      
//       // Navigate to Impact page
//       navigation.navigate('Impact');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to save markers.');
//       console.error("Error saving markers to AsyncStorage: ", error);
//     }
//   };

//   return (
//     <View style={tw`flex-1`}>
//       {/* Main Map View */}
//       {polygonData.length > 0 ? (
//         <MapView
//           style={tw`flex-1`}
//           initialRegion={{
//             latitude: polygonData[0]?.latitude || 37.78825,
//             longitude: polygonData[0]?.longitude || -122.4324,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//           onPress={handleMapPress}
//         >
//           {/* Render polygon */}
//           {polygonData.length > 0 && (
//             <Polygon
//               coordinates={polygonData}
//               fillColor="rgba(0, 0, 255, 0.3)"
//               strokeColor="rgba(0, 0, 255, 0.5)"
//             />
//           )}

//           {/* Render local plant markers */}
//           {localPlantMarkers.map((marker, index) => (
//             <Marker 
//               key={index} 
//               coordinate={marker} 
//               pinColor={marker.plant} // Set marker color based on plant type
//             />
//           ))}
//         </MapView>
//       ) : (
//         <Text style={tw`text-center text-gray-500 p-4`}>
//           No polygon or markers to display.
//         </Text>
//       )}

//       {/* Side Menu with Plant Selection */}
//       <View style={[tw`absolute right-4 top-16`, { flexDirection: 'column' }]}>
//         {plantColors.map((plant, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               tw`mb-4 rounded-full`, 
//               { backgroundColor: plant.color, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }
//             ]}
//             onPress={() => setSelectedPlant(plant.color)} // Select the plant color
//           >
//             <Text style={tw`text-white`}>{plant.name.charAt(0)}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Save button */}
//       <TouchableOpacity onPress={handleSaveMarkers} style={tw`bg-blue-600 p-2 rounded absolute bottom-8 left-4`}>
//         <Text style={tw`text-white text-center`}>Save Markers</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

export default function SmallMap({ route, savedPolygon = [] }) {
  const navigation = useNavigation();
  const [localPlantMarkers, setLocalPlantMarkers] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('red');
  const polygonData = route?.params?.savedPolygon || savedPolygon;

  const plantColors = [
    { color: 'red', name: 'Red' },
    { color: 'yellow', name: 'Yellow' },
    { color: 'green', name: 'Green' },
    { color: 'orange', name: 'Orange' },
    { color: 'blue', name: 'Blue' }
  ];

  const handleMapPress = (e) => {
    const newMarker = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      plant: selectedPlant
    };
    setLocalPlantMarkers([...localPlantMarkers, newMarker]);
  };

  const handleSaveMarkers = async () => {
    try {
      const storedPolygons = JSON.parse(await AsyncStorage.getItem('savedPolygons')) || [];
      const updatedPolygons = storedPolygons.map((item, index) =>
        index === storedPolygons.length - 1
          ? { ...item, markers: localPlantMarkers }
          : item
      );

      await AsyncStorage.setItem('savedPolygons', JSON.stringify(updatedPolygons));
      console.log('Updated polygon with markers: ', updatedPolygons);
      navigation.navigate('Impact');
    } catch (error) {
      Alert.alert('Error', 'Failed to save markers.');
      console.error("Error saving markers to AsyncStorage: ", error);
    }
  };

  return (
    <View style={tw`flex-1`}>
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
          {polygonData.length > 0 && (
            <Polygon
              coordinates={polygonData}
              fillColor="rgba(0, 0, 255, 0.3)"
              strokeColor="rgba(0, 0, 255, 0.5)"
            />
          )}

          {localPlantMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              pinColor={marker.plant}
            />
          ))}
        </MapView>
      ) : (
        <Text style={tw`text-center text-gray-700 p-4`}>
          No polygon or markers to display.
        </Text>
      )}

      <View style={[tw`absolute right-4 top-16`, { flexDirection: 'column' }]}>
        {plantColors.map((plant, index) => (
          <TouchableOpacity
            key={index}
            style={[
              tw`mb-4 rounded-full`,
              { backgroundColor: plant.color, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }
            ]}
            onPress={() => setSelectedPlant(plant.color)}
          >
            <Text style={tw`text-black`}>{plant.name.charAt(0)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSaveMarkers}
        style={tw`bg-green-700 p-3 rounded-full absolute bottom-8 left-4 right-4`}
      >
        <Text style={tw`text-white text-center`}>Save Markers</Text>
      </TouchableOpacity>
    </View>
  );
}
