import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use FontAwesome for leaf/tree/recycle/water icons
import tw from 'twrnc'; // For Tailwind styling

// A placeholder function for rendering progress bars
const ProgressBar = ({ percentage, label }) => {
  return (
    <View style={tw`items-center`}>
      <View style={tw`w-16 h-16 justify-center`}>
        {/* Mock circular progress by setting text over a placeholder*/}
        <Text style={tw`text-green-500 text-base`}>{percentage}%</Text>
      </View>
      <Text style={tw`text-xs font-medium text-center mt-2`}>{label}</Text>
    </View>
  );
};

const Impact = () => {
  const [savedPolygons, setSavedPolygons] = useState([]);

  useEffect(() => {
    // Load saved polygons from local storage
    // Use AsyncStorage or other persistent storage methods for React Native
    let loadedPolygons = [...Array(2)]; // Mocked data for representation
    setSavedPolygons(loadedPolygons);
  }, []);

  const getRandomPercentage = () => Math.floor(Math.random() * 100);

  const metrics = [
    { label: 'Biomass Production', value: getRandomPercentage() },
    { label: 'Plant Vitality', value: getRandomPercentage() },
    { label: 'Invasive Species Removed', value: getRandomPercentage() },
    { label: 'Water Retention', value: getRandomPercentage() },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`items-center p-8`}>
        <Text style={tw`text-3xl font-bold mb-8 text-center`}>Impact Dashboard</Text>

        {savedPolygons.length ? (
          savedPolygons.map((_, index) => (
            <View
              key={index}
              style={tw`bg-white shadow-lg rounded-lg p-6 mb-6 w-11/12`}
            >
              <Text style={tw`text-lg font-bold text-center mb-6`}>
                Restoration Area {index + 1}
              </Text>

              {/* Placeholder for a static map section */}
              <View style={tw`w-full h-40 bg-gray-200 rounded-lg mb-4`} />

              <View style={tw`flex-row justify-around`}>
                {metrics.map((metric, i) => (
                  <ProgressBar key={i} percentage={metric.value} label={metric.label} />
                ))}
              </View>
            </View>
          ))
        ) : (
          <Text style={tw`text-center text-gray-500`}>
            No polygons have been saved yet.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Impact;