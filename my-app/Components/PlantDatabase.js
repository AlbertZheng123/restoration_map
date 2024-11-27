import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Icon } from 'react-native-elements';

// Import all plant images
import OakImage from '../assets/oakplant.png';
import MapleImage from '../assets/mapleplant.png';
import PineImage from '../assets/pineplant.png';
import BirchImage from '../assets/birchplant.png';
import CedarImage from '../assets/cedarplant.png';
import KudzuImage from '../assets/kudzuplant.jpg';
import KnotweedImage from '../assets/knotweed.png';
import MustardImage from '../assets/mustardplant.jpg';
import PurpleImage from '../assets/purpleplant.png';
import HyacinthImage from '../assets/hyacinthplant.png';
import DefaultImage from '../assets/plant.jpg';

const nativePlants = [
  { name: 'Oak', description: 'Oak trees are large, long-lived trees found worldwide.', image: OakImage, detail: "OakPlant" },
  { name: 'Maple', description: 'Maple trees are known for their beautiful fall colors and syrup.', image: MapleImage, detail: "MaplePlant" },
  { name: 'Pine', description: 'Pine trees are evergreen conifers that are commonly found in forests.', image: PineImage, detail: "PinePlant" },
  { name: 'Birch', description: 'Birch trees are known for their distinctive white bark and delicate leaves.', image: BirchImage, detail: "BirchPlant" },
  { name: 'Cedar', description: 'Cedar trees are aromatic evergreens often used for wood products.', image: CedarImage, detail: "CedarPlant" }
];

const invasivePlants = [
  { name: 'Kudzu', description: 'Kudzu is an invasive vine that grows rapidly and can choke out other vegetation.', image: KudzuImage, detail: "KudzuPlant" },
  { name: 'Japanese Knotweed', description: 'This plant is notorious for its aggressive growth and ability to damage infrastructure.', image: KnotweedImage, detail: "KnotweedPlant" },
  { name: 'Garlic Mustard', description: 'Garlic mustard is an invasive herb that can displace native plants in forests.', image: MustardImage, detail: "MustardPlant" },
  { name: 'Purple Loosestrife', description: 'This invasive wetland plant can take over marshes, disrupting native ecosystems.', image: PurpleImage, detail: "PurplePlant" },
  { name: 'Water Hyacinth', description: 'Water hyacinth is a floating aquatic plant that can block waterways and harm aquatic life.', image: HyacinthImage, detail: "HyacinthPlant" }
];

function PlantDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("native");
  const [userPlants, setUserPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: '', description: '', image: null });
  const navigation = useNavigation();

  const filteredPlants = activeTab === 'native'
    ? nativePlants.concat(userPlants).filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : invasivePlants.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const navigateToPlant = (plant) => {
    if (plant.detail) {
      navigation.navigate(plant.detail);
    }
  };

  const addNewPlant = () => {
    const plantImage = newPlant.image || DefaultImage;
    setUserPlants([...userPlants, { ...newPlant, image: plantImage }]);
    setNewPlant({ name: '', description: '', image: DefaultImage });
    setShowForm(false);
  };

  return (
    <SafeAreaView style={[tw`flex-1`, {backgroundColor: '#EDEADE'}]}>
      <View>
        <Text style={tw`text-center text-3xl mb-4 font-bold`}>Plants Database</Text>
      </View>
      <View style={tw`flex-row p-4`}>
        <TouchableOpacity
          onPress={() => setActiveTab('native')}
          style={tw`flex-1 p-2 rounded ${activeTab === 'native' ? 'bg-green-500' : 'bg-white'} border border-black`}
        >
          <Text style={tw`text-center text-black`}>Native Plants</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('invasive')}
          style={tw`flex-1 p-2 rounded ${activeTab === 'invasive' ? 'bg-green-500' : 'bg-white'} border border-black`}
        >
          <Text style={tw`text-center text-black`}>Invasive Species</Text>
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
          <View key={index} style={[tw`p-4 mb-2 shadow rounded-lg flex-row items-center`, {backgroundColor: '#EDEADE'}]}>
            <Image source={item.image} style={tw`w-16 h-16 mr-4 rounded`} />
            <TouchableOpacity 
              style={tw`flex-1 flex-row justify-between items-center`} 
              onPress={() => navigateToPlant(item)}
            >
              <View style={tw`flex-1`}>
                <Text style={tw`font-bold`} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
                <Text style={tw``}>{item.description}</Text>
              </View>
              <Icon name="right" type="ant-design" size={20} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal for New Plant Form */}
      <Modal visible={showForm} animationType="slide">
        <SafeAreaView style={tw`p-4 flex-1 justify-center`}>
          <TextInput
            placeholder="Plant Name"
            value={newPlant.name}
            onChangeText={(text) => setNewPlant({ ...newPlant, name: text })}
            style={tw`bg-black text-white p-2 rounded mb-2`}
          />
          <TextInput
            placeholder="Description"
            value={newPlant.description}
            onChangeText={(text) => setNewPlant({ ...newPlant, description: text })}
            style={tw`bg-black text-white p-2 rounded mb-2`}
          />
          <TouchableOpacity style={tw`p-2 bg-green-600 rounded mb-2`} onPress={addNewPlant}>
            <Text style={tw`text-center text-white`}>Save Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-2 bg-red-600 rounded`} onPress={() => setShowForm(false)}>
            <Text style={tw`text-center text-white`}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Button to add a new plant */}
      <View style={tw`p-4`}>
        <TouchableOpacity 
          style={tw`p-4 bg-blue-600 rounded text-center`}
          onPress={() => setShowForm(true)}
        >
          <Text style={tw`text-center text-white`}>Add New Plant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default PlantDatabase;