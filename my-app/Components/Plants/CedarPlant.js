import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import tw from 'twrnc'; // Tailwind for styling

function CedarPlant() {
    return (
        <View>
            <Text style={tw`text-center font-bold text-3xl mb-4`}>CedarPlant Info</Text>
        </View>
    )
}

export default CedarPlant;