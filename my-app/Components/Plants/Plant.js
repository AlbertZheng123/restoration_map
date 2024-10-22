import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TextInput } from 'react-native';
import tw from 'twrnc'; // Tailwind for styling

const Plant = ({ imageSrc, name, terrain, terrainExample, growthDuration, growthExample, description, descriptionExample, usageCount, usageExample }) => {
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-900`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Image source={imageSrc} style={tw`w-full h-48 rounded-lg mb-4`} resizeMode="contain" />
        <Text style={tw`text-center text-2xl font-extrabold text-white mb-4`}>{name}</Text>
        <View style={tw`space-y-10`}>
          <InfoSection label="Terrain" leftInfo={terrainExample} rightInfo={terrain} editable />
          <InfoSection label="Growth Duration" leftInfo={growthExample} rightInfo={growthDuration} editable />
          <InfoSection label="Description" leftInfo={descriptionExample} rightInfo={description} />
          <InfoSection label="Usage Count" leftInfo={usageExample} rightInfo={usageCount.toString()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoSection = ({ label, leftInfo, rightInfo, editable = false }) => {
  const [value, setValue] = useState(rightInfo);

  return (
    <View>
      <Text style={tw`text-sm text-green-500 mb-2`}>{label}</Text>
      <View style={tw`bg-gray-800 rounded-lg p-4`}>
        <View style={tw`flex-row justify-between items-start`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xs text-gray-400 mb-1`}>{leftInfo}</Text>
            {editable ? (
              <TextInput
                style={tw`text-sm text-gray-200`}
                value={value}
                onChangeText={setValue}
                placeholder="Edit here"
                placeholderTextColor="#ccc"
              />
            ) : (
              <Text style={tw`text-sm text-gray-200`}>{value}</Text>
            )}
          </View>
          <View style={tw`flex-1 items-end`}>
            <Text style={tw`text-xs text-gray-300 mb-1`}>Details</Text>
            <Text style={tw`text-sm text-gray-100`}>{value}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Plant;
