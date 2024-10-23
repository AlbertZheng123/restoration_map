import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import navigation
import DisplayMap from './DisplayMap';

const InnerPolygonsSection = () => {
  const [innerPolygonsData, setInnerPolygonsData] = useState([]);
  const navigation = useNavigation(); // Initialize navigation hook

  // Load saved inner polygons from AsyncStorage
  useEffect(() => {
    const loadInnerPolygons = async () => {
      try {
        const storedInnerPolygons = await AsyncStorage.getItem('savedPolygonData');
        if (storedInnerPolygons) {
          const parsedInnerPolygons = JSON.parse(storedInnerPolygons);
          console.log('Loaded inner polygons from AsyncStorage:', parsedInnerPolygons);
          setInnerPolygonsData(parsedInnerPolygons);
        }
      } catch (error) {
        console.error('Failed to load inner polygons:', error);
      }
    };
    loadInnerPolygons();
  }, []);

  // Function to navigate to the detailed view of the selected inner polygon
  const goToInnerPolygonDetails = (mainPolygon, innerPolygons) => {
    navigation.navigate('InnerPolygonDetails', {
      mainPolygon,      // Pass the main polygon
      innerPolygons,    // Pass the inner polygons
    });
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`items-center p-8`}>
        <Text style={tw`text-3xl font-bold mb-8 text-center`}>Inner Polygons Section</Text>

        {/* Render Inner Polygons Cards */}
        <FlatList
          data={innerPolygonsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              key={index} 
              style={tw`bg-white shadow-lg rounded-lg p-8 mb-8 w-full h-128`} 
              onPress={() => goToInnerPolygonDetails(item.mainPolygon, item.innerPolygons)}
            >
              <Text style={tw`text-xl font-bold text-center mb-6`}>
                Inner Polygon Area {index + 1}
              </Text>
              {/* Display main polygon with inner polygons */}
              <DisplayMap 
                polygon={item.mainPolygon} 
                markers={[]} 
                mapHeight="400px"
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No inner polygons have been saved yet.</Text>}
        />
      </View>
    </View>
  );
};

export default InnerPolygonsSection;
