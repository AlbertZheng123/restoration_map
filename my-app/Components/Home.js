import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import tw from 'twrnc';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true); // Initialize all hooks at the top level
  const [activeIcon, setActiveIcon] = useState(null);

  // Simulate loading with a useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Trigger after 2 seconds

    return () => clearTimeout(timer); // Clean-up function to clear timer
  }, []);

  // Icon and description data
  const iconData = [
    { icon: 'user', label: 'Profile', description: 'Manage your personal profile and settings.' },
    { icon: 'settings', label: 'Settings', description: 'Customize your experience and make it unique to your needs.' },
    { icon: 'activity', label: 'Activity', description: 'Track your activity and review your engagement stats.' },
    { icon: 'layers', label: 'Layers', description: 'Explore and manage your data with a comprehensive layer view.' }
  ];

  // Conditional rendering controlled by isLoading state
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-900`}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={tw`text-white mt-4`}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-900`}>
      <View style={tw`bg-gray-800 items-center justify-center py-12`}>
        <Text style={tw`text-3xl text-white font-bold text-center mb-4`}>
          Welcome to Our Platform
        </Text>
        <Text style={tw`text-lg text-white text-center mb-8`}>
          Create and customize your personal space.
        </Text>
        <TouchableOpacity
          style={tw`bg-yellow-500 px-8 py-4 rounded-full flex-row items-center justify-center mb-8`}
          onPress={() => console.log('Button pressed')}
        >
          <Text style={tw`text-white text-lg mr-2`}>Explore Now</Text>
          <Icon name="arrow-right" color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <View style={tw`bg-gray-700 text-white px-6 py-8`}>
        <Text style={tw`text-center text-xl font-bold mb-4`}>Feature Overview</Text>
        <View style={tw`flex-row justify-around mt-12`}>
          {iconData.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => setActiveIcon(index)} style={tw`items-center`}>
              <Icon name={item.icon} size={50} color="white" />
              <Text style={tw`mt-2 text-lg text-white`}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {activeIcon !== null && (
          <Text style={tw`text-center mt-4 text-sm text-white`}>{iconData[activeIcon].description}</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Home;
