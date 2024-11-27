import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Button, LogBox } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import * as Notifications from 'expo-notifications';


// In your component or main file (e.g., App.js), add this:
LogBox.ignoreLogs(['Warning: Grid: Support for defaultProps']);
// In your component or main file (e.g., App.js), add this:
LogBox.ignoreLogs(['Found screens with the same name nested inside one another']);

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const navigation = useNavigation();
  const [selectedHours, setSelectedHours] = useState('17');
  const [selectedMinutes, setSelectedMinutes] = useState('00');
  const [selectedDays, setSelectedDays] = useState([]);
  const featureDescriptions = {
    user: "Here's the basic info rundown of how our app works",
    settings: "Customize your polygons with our Map Feature",
    activity: "View important data about them",
    layers: "Explore more detailed plants in our database!"
  };
  const daysOfWeek = [
    { id: 'mon', name: 'Monday' },
    { id: 'tue', name: 'Tuesday' },
    { id: 'wed', name: 'Wednesday' },
    { id: 'thu', name: 'Thursday' },
    { id: 'fri', name: 'Friday' },
    { id: 'sat', name: 'Saturday' },
    { id: 'sun', name: 'Sunday' }
  ];
  const scheduleNotifications = async () => {
    for (const day of selectedDays) {
      const dayName = daysOfWeek.find(d => d.id === day).name;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Plant Reminder",
          body: "Check your plants today!",
        },
        trigger: {
          weekday: getDayOffset(day) + 1,
          hour: parseInt(selectedHours, 10),
          minute: parseInt(selectedMinutes, 10),
          repeats: true,
        },
      });
      console.log(`Notification scheduled for ${dayName} at ${selectedHours}:${selectedMinutes}`);
    }
    // Notify the user that preferences were saved
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Preferences Saved",
        body: "Your notification preferences have been updated.",
      },
      trigger: null,
    });
  };
  const getDayOffset = (dayId) => {
    const days = {
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
      sun: 7
    };
    return days[dayId];
  };
  return (
    <View style={tw`flex-1 bg-[#EDEADE]`}>
      <ScrollView contentContainerStyle={tw`p-6`}>
        {/* Header Section with Logo */}
        <View style={tw`items-center mb-6`}>
          <Image source={require('../assets/logo.png')} style={tw`w-24 h-24 mb-4`} />
          <Text style={tw`text-2xl text-black font-bold`}>Welcome to Our Platform</Text>
          <Text style={tw`text-lg text-black mt-2`}>Bringing you the best experience with our app.</Text>
        </View>
        {/* App Description */}
        <View style={tw`bg-white p-4 rounded-lg mb-6`}>
          <Text style={tw`text-base text-black`}>
            Our app provides a comprehensive mapping feature that allows you to place coordinates and see which plants grow nearby. You can save these regions, known as "polygons", and explore them on a dedicated dashboard. Additionally, explore our plant database to reference plant details and track personal usage statistics.
          </Text>
        </View>
        {/* Feature Overview */}
        <View style={tw`bg-white p-4 rounded-lg mb-6`}>
          <Text style={tw`text-xl text-black font-bold text-center mb-4`}>Features Overview</Text>
          <View style={tw`flex-row justify-around mb-4`}>
            {Object.keys(featureDescriptions).map((feature) => (
              <FeatureIcon key={feature} name={feature} label={featureDescriptions[feature]} setActiveFeature={setActiveFeature} />
            ))}
          </View>
        </View>
        {/* Description Section */}
        {activeFeature && (
          <View style={tw`bg-white p-4 rounded-lg mb-6`}>
            <Text style={tw`text-sm text-black text-center`}>
              {featureDescriptions[activeFeature]}
            </Text>
          </View>
        )}
        {/* Notification Customization */}
        <View style={tw`bg-white p-4 rounded-lg mb-6`}>
          <Text style={tw`text-xl text-black font-bold text-center mb-4`}>Notification Preferences</Text>
          {/* Day Selection */}
          <View style={tw`mb-4`}>
            <MultiSelect
              items={daysOfWeek}
              uniqueKey="id"
              onSelectedItemsChange={(items) => setSelectedDays(items)}
              selectedItems={selectedDays}
              selectText="Choose Days"
              searchInputPlaceholderText="Search Days..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#000"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              submitButtonColor="#CCC"
              submitButtonText="Submit"
            />
          </View>
          {/* Time Picker */}
          <View style={tw`flex-row justify-between mb-30`}>
            <Picker
              selectedValue={selectedHours}
              style={{ height: 50, width: 100 }}
              onValueChange={(itemValue) => setSelectedHours(itemValue)}
            >
              {[...Array(24).keys()].map(h => <Picker.Item key={h} label={`${h}`} value={`${h}`} />)}
            </Picker>
            <Picker
              selectedValue={selectedMinutes}
              style={{ height: 50, width: 100 }}
              onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
            >
              {[0, 15, 30, 45].map(m => (
                <Picker.Item key={m} label={m < 10 ? `0${m}` : `${m}`} value={m < 10 ? `0${m}` : `${m}`} />
              ))}
            </Picker>
          </View>
          <Button title="Save Preferences" onPress={scheduleNotifications} />
        </View>
        {/* Interactive Area */}
        <View style={tw`mb-6`}>
          <TouchableOpacity
            style={tw`bg-green-600 py-4 rounded-full flex-row items-center justify-center mb-4`}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={tw`text-white text-lg mr-2`}>Explore Now</Text>
            <Icon name="arrow-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* Announcements/Notifications Header */}
        <Text style={tw`text-xl text-black font-bold mb-4`}>Latest Updates</Text>
        {/* Separate Update Boxes */}
        <View style={tw`bg-white p-4 rounded-lg mb-4`}>
          <Text style={tw`text-lg text-black font-bold mb-2`}>Update #1</Text>
          <Text style={tw`text-base text-black`}>
            We've revamped the UI. Our app is now fully functional! From enhancing the user interface to providing an intuitive mapping experience, we’ve done it all.
          </Text>
        </View>
        <View style={tw`bg-white p-4 rounded-lg mb-4`}>
          <Text style={tw`text-lg text-black font-bold mb-2`}>Update #2</Text>
          <Text style={tw`text-base text-black`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
        {/* Footer Section */}
        <View style={tw`items-center mt-6`}>
          <Text style={tw`text-sm text-gray-600`}>© 2023 Your Company Name. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Create a reusable component for feature icons
const FeatureIcon = ({ name, label, setActiveFeature }) => (
  <TouchableOpacity style={tw`items-center`} onPress={() => setActiveFeature(name)}>
    <Icon name={name} size={40} color="black" />
    <Text style={tw`mt-2 text-black`}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
  </TouchableOpacity>
);

export default Home;