import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import tw from 'twrnc'; // For Tailwind styles
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons

const nativePlants = [
  { name: 'Oak', description: 'Oak trees are large, long-lived trees found worldwide.' },
  { name: 'Maple', description: 'Maple trees are known for their beautiful fall colors and syrup.' },
  { name: 'Pine', description: 'Pine trees are evergreen conifers that are commonly found in forests.' },
  { name: 'Birch', description: 'Birch trees are known for their distinctive white bark and delicate leaves.' },
  { name: 'Cedar', description: 'Cedar trees are aromatic evergreens often used for wood products.' }
];

const invasivePlants = [
  { name: 'Kudzu', description: 'Kudzu is an invasive vine that grows rapidly and can choke out other vegetation.' },
  { name: 'Japanese Knotweed', description: 'This plant is notorious for its aggressive growth and ability to damage infrastructure.' },
  { name: 'Garlic Mustard', description: 'Garlic mustard is an invasive herb that can displace native plants in forests.' },
  { name: 'Purple Loosestrife', description: 'This invasive wetland plant can take over marshes, disrupting native ecosystems.' },
  { name: 'Water Hyacinth', description: 'Water hyacinth is a floating aquatic plant that can block waterways and harm aquatic life.' }
];

export default function PlantDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("native");

  const filteredPlants = activeTab === 'native'
    ? nativePlants.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : invasivePlants.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row bg-gray-200 p-4`}>
        <TouchableOpacity
          onPress={() => setActiveTab('native')}
          style={tw`flex-1 p-2 rounded ${activeTab === 'native' ? 'bg-green-500' : 'bg-gray-400'}`}
        >
          <Text style={tw`text-center text-white`}>Native Plants</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('invasive')}
          style={tw`flex-1 p-2 rounded ${activeTab === 'invasive' ? 'bg-green-500' : 'bg-gray-400'}`}
        >
          <Text style={tw`text-center text-white`}>Invasive Species</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`bg-white p-2 rounded shadow`}
          placeholder={`Search ${activeTab === 'native' ? 'native plants' : 'invasive species'}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredPlants}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No plants match your search.</Text>}
        renderItem={({ item, index }) => (
          <View key={index} style={tw`p-4 bg-white mb-2 shadow rounded-lg`}>
            <Text style={tw`font-bold`}>{index + 1}. {item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
