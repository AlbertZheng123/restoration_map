import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Picker, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import tw from 'twrnc';

const nativePlantSpecies = [
  { name: 'Oak', color: 'green' },
  { name: 'Maple', color: 'green' },
  { name: 'Pine', color: 'green' },
  { name: 'Birch', color: 'green' },
  { name: 'Cedar', color: 'green' },
];

const invasivePlantSpecies = [
  { name: 'Kudzu', color: 'red' },
  { name: 'Japanese Knotweed', color: 'red' },
  { name: 'Garlic Mustard', color: 'red' },
  { name: 'Purple Loosestrife', color: 'red' },
  { name: 'Water Hyacinth', color: 'red' },
];

export default function SmallMap({ savedPolygon, onSavePlantMarkers, plantMarkers = [], isViewOnly = false, mapHeight = "400px" }) {
  const [localPlantMarkers, setLocalPlantMarkers] = useState(plantMarkers);
  const [activeSpecies, setActiveSpecies] = useState(null); // Tracks active species (either plant or invasive)

  useEffect(() => {
    setLocalPlantMarkers(plantMarkers);
  }, [plantMarkers]);

  const handleMapClick = useCallback((e) => {
    if (isViewOnly || !activeSpecies) return;

    const newMarker = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      species: activeSpecies.name,
      color: activeSpecies.color,
    };

    const updatedMarkers = [...localPlantMarkers, newMarker];
    setLocalPlantMarkers(updatedMarkers);

    if (onSavePlantMarkers) {
      onSavePlantMarkers(updatedMarkers);
    }
  }, [activeSpecies, isViewOnly, localPlantMarkers, onSavePlantMarkers]);

  return (
    <View style={[tw`flex-1`, { height: mapHeight }]}>
      {!isViewOnly && (
        <View style={tw`p-4`}>
          <Text style={tw`mb-2 font-bold`}>Native Plant Species</Text>
          <Picker selectedValue={activeSpecies?.name} onValueChange={(itemValue) => {
            const selectedSpecies = nativePlantSpecies.find(species => species.name === itemValue) || invasivePlantSpecies.find(species => species.name === itemValue);
            setActiveSpecies(selectedSpecies);
          }}>
            <Picker.Item label="Select Native Plant" value="" />
            {nativePlantSpecies.map((species, index) => (
              <Picker.Item key={index} label={species.name} value={species.name} />
            ))}
          </Picker>

          <Text style={tw`mt-4 mb-2 font-bold`}>Invasive Plant Species</Text>
          <Picker selectedValue={activeSpecies?.name} onValueChange={(itemValue) => {
            const selectedSpecies = nativePlantSpecies.find(species => species.name === itemValue) || invasivePlantSpecies.find(species => species.name === itemValue);
            setActiveSpecies(selectedSpecies);
          }}>
            <Picker.Item label="Select Invasive Plant" value="" />
            {invasivePlantSpecies.map((species, index) => (
              <Picker.Item key={index} label={species.name} value={species.name} />
            ))}
          </Picker>
          <Text>Current Selected Species: {activeSpecies ? activeSpecies.name : 'None'}</Text>
        </View>
      )}

      <MapView
        style={tw`flex-1`}
        initialRegion={{
          latitude: 34.4269,
          longitude: -118.5754,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={handleMapClick} // Adds marker on map press
      >
        {savedPolygon && savedPolygon.length > 0 && (
          <Polygon coordinates={savedPolygon} fillColor="rgba(0, 0, 255, 0.3)" strokeColor="rgba(0, 0, 255, 0.5)" />
        )}
        {localPlantMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            pinColor={marker.color}
          />
        ))}
      </MapView>
    </View>
  );
}