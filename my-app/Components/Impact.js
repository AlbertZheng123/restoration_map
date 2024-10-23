import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DisplayMap from './DisplayMap';
import { useNavigation } from '@react-navigation/native'; // Import navigation

const Impact = () => {
  const [savedPolygons, setSavedPolygons] = useState([]);
  const navigation = useNavigation(); // Initialize navigation hook

  // Load saved polygons and markers from AsyncStorage
  useEffect(() => {
    const loadSavedPolygons = async () => {
      try {
        const storedPolygons = await AsyncStorage.getItem('savedPolygons');
        if (storedPolygons) {
          const parsedPolygons = JSON.parse(storedPolygons);
          console.log('Loaded polygons from AsyncStorage in Impact.js:', parsedPolygons);
          const validPolygons = parsedPolygons.filter(
            (item) => item.polygon?.length > 0 && item.markers?.length > 0
          );
          setSavedPolygons(validPolygons);
        }
      } catch (error) {
        console.error('Failed to load saved polygons in Impact.js:', error);
      }
    };
    loadSavedPolygons();
  }, []);

  // Clear ALL data from AsyncStorage
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear(); // This will remove everything in AsyncStorage
      setSavedPolygons([]); // Clear state
      Alert.alert('Success', 'All AsyncStorage data has been cleared.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data.');
      console.error('Failed to clear AsyncStorage data:', error);
    }
  };

  // Function to navigate to the ImpactDetails page for the clicked card
  const goToImpactDetails = (polygon, markers) => {
    console.log('Markers being passed to ImpactDetails:', markers); // Check markers data

    // Placeholder statistics, replace with real data as needed
    const biodiversityPercent = 75; // Placeholder value
    const coveragePercent = 60; // Placeholder value

    navigation.navigate('ImpactDetails', {
      polygon,
      markers, // Pass markers with plant type and color info
      biodiversityPercent,
      coveragePercent,
    });
  };

  // Function to navigate to the Inner Polygons Section
  const goToInnerPolygonsSection = () => {
    navigation.navigate('InnerPolygonsSection'); // Navigating to the inner polygons section
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Reduced padding in this View */}
      <View style={tw`p-4`}>

        <Text style={tw`text-3xl font-bold mb-8 text-center`}>Impact Dashboard</Text>

        {/* Row with two buttons: Clear All Data and View Inner Polygons Section */}
        <View style={tw`flex-row justify-between w-full mb-8`}>
          <TouchableOpacity onPress={clearAllData} style={tw`bg-red-600 p-3 rounded w-1/2 mr-2`}>
            <Text style={tw`text-white text-center`}>Clear All Data</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToInnerPolygonsSection} style={tw`bg-green-600 p-3 rounded w-1/2 ml-2`}>
            <Text style={tw`text-white text-center`}>View Inner Polygons Section</Text>
          </TouchableOpacity>
        </View>

        {/* Render Impact Cards */}
        <FlatList
          data={savedPolygons}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              key={index} 
              style={tw`bg-white shadow-lg rounded-lg mb-8 w-full h-128`} // No extra padding, uses full width
              onPress={() => goToImpactDetails(item.polygon, item.markers || [])} // Navigating to details
            >
              <Text style={tw`text-xl font-bold text-center mb-6`}>
                Restoration Area {index + 1}
              </Text>
              <DisplayMap 
                polygon={item.polygon} 
                markers={item.markers || []} 
                mapHeight="400px"
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No polygons have been saved yet.</Text>}
        />
      </View>
    </View>
  );
};

export default Impact;
