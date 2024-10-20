import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmallMap from './SmallMap';

const Impact = () => {
  const [savedPolygons, setSavedPolygons] = useState([]);

  useEffect(() => {
    const loadSavedPolygons = async () => {
      try {
        const storedPolygons = await AsyncStorage.getItem('savedPolygons');
        if (storedPolygons) {
          const parsedPolygons = JSON.parse(storedPolygons);
          
          console.log('Loaded polygons from AsyncStorage in Impact.js: ', parsedPolygons);
          
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
  

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`items-center p-8`}>
        <Text style={tw`text-3xl font-bold mb-8 text-center`}>Impact Dashboard</Text>

        <FlatList
          data={savedPolygons}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            // Log the item to ensure data is being passed correctly
            console.log(`Rendering polygon data for item ${index}: `, item);
            return (
              <View key={index} style={tw`bg-white shadow-lg rounded-lg p-8 mb-8 w-full h-96`}>
                <Text style={tw`text-xl font-bold text-center mb-6`}>
                  Restoration Area {index + 1}
                </Text>
                {/* Display the polygon using SmallMap component */}
                <SmallMap 
                  savedPolygon={item.polygon} 
                  plantMarkers={item.markers || []} 
                  isViewOnly={true} 
                  mapHeight="500px"  
                />
              </View>
            );
          }}
          removeClippedSubviews={false}
          ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No polygons have been saved yet.</Text>}
        />
      </View>
    </View>
  );
};

export default Impact;