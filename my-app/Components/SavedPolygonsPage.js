import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmallMap from './SmallMap'; // Ensure this is correctly implemented for React Native
import tw from 'twrnc'; // Tailwind-like utility-first CSS for React Native

export default function SavedPolygonsPage() {
  const [savedPolygons, setSavedPolygons] = useState([]);

  useEffect(() => {
    const loadSavedPolygons = async () => {
      try {
        const storedPolygons = await AsyncStorage.getItem('savedPolygons');
        if(storedPolygons) {
          setSavedPolygons(JSON.parse(storedPolygons));
        }
      } catch (error) {
        console.error('Failed to load saved polygons:', error);
      }
    };
    
    loadSavedPolygons();
  }, []);
  
  return (
    <View style={tw`flex-1 flex-row`}>
      <View style={tw`w-64 bg-gray-800 text-white p-4`}>
        {/* Sidebar placeholder */}
        <Text style={tw`text-white`}>Sidebar</Text>
      </View>
      <ScrollView style={tw`flex-grow p-8`}>
        <Text style={tw`text-center text-3xl font-bold mb-4`}>Saved Polygon Sections</Text>
        {savedPolygons.length > 0 ? (
          <FlatList 
            data={savedPolygons}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={tw`mb-6 w-full max-w-xl p-4 border border-gray-300 rounded-lg shadow-md mx-auto`}>
                <Text style={tw`text-lg font-semibold mb-2`}>Polygon {index + 1}</Text>
                <SmallMap 
                  savedPolygon={item.polygon}
                  plantMarkers={item.markers}
                  isViewOnly={true}
                  mapHeight="200px"
                  mapWidth="100%"
                />
              </View>
            )}
          />
        ) : (
          <Text style={tw`text-center`}>No polygons have been saved yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};