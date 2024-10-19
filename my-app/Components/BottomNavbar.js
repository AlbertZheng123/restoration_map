import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import Home from './Home';
import MapComponent from './Map';
import Impact from './Impact';
import PlantDatabase from './PlantDatabase'; // Assuming PlantDatabase is a react-native component too

const Tab = createBottomTabNavigator();

const BottomNavBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Map') {
            iconName = 'map';
          } else if (route.name === 'Impact') {
            iconName = 'info';
          } else if (route.name === 'Plants') {
            iconName = 'inbox';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#61CD5F',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#333' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Map" component={MapComponent} />
      <Tab.Screen name="Impact" component={Impact} />
      <Tab.Screen name="Plants" component={PlantDatabase} />
    </Tab.Navigator>
  );
};

export default BottomNavBar;
