import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc'; // Tailwind for styling
import Home from './Home';
import MapComponent from './Map';
import Impact from './Impact';
import PlantDatabase from './PlantDatabase';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={[tw`absolute bottom-0 left-0 right-0 py-5`, {backgroundColor: '#EDEADE'}]}>
      {/* Adjusting padding to increase vertical height */}
      <View style={tw`flex-row justify-around items-center h-12`}>
        {/* Set a fixed height for the tab bar to make it more prominent */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
          const isFocused = state.index === index;
          const iconName = route.name === 'Home' ? 'home' :
                           route.name === 'Map' ? 'map' :
                           route.name === 'Impact' ? 'search' : // Change to search icon
                           'inbox';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={tw`flex-1 items-center justify-center relative`}
            >
              {isFocused && (
                <View style={tw`absolute bg-green-500 opacity-20 w-24 h-10 rounded-full`} />
              )}
              <View style={tw`flex-row items-center`}>
                <Icon name={iconName} size={24} color={isFocused ? '#61CD5F' : 'gray'} />
                {isFocused && (
                  <Text style={tw`ml-2 text-black font-bold`}>
                    {label}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const BottomNavBar = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Map" component={MapComponent} options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen name="Impact" component={Impact} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="Plants" component={PlantDatabase} options={{ tabBarLabel: 'Plants' }} />
    </Tab.Navigator>
  );
};

export default BottomNavBar;
