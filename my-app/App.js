import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavBar from './Components/BottomNavbar'; // Import BottomNavBar
import SmallMap from './Components/SmallMap'; // Import SmallMap
import OakPlant from './Components/Plants/Oak';
import MaplePlant from './Components/Plants/MaplePlant';
import PinePlant from './Components/Plants/PinePlant';
import BirchPlant from './Components/Plants/BirchPlant';
import CedarPlant from './Components/Plants/CedarPlant';
import KudzuPlant from './Components/Plants/KudzuPlant';
import KnotweedPlant from './Components/Plants/KnotweedPlant';
import MustardPlant from './Components/Plants/MustardPlant';
import PurplePlant from './Components/Plants/PurplePlant';
import HyacinthPlant from './Components/Plants/Hyacinth';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Bottom Tab Navigator */}
        <Stack.Screen name="Main" component={BottomNavBar} options={{ headerShown: false }} />
        
        {/* Stack Screen for SmallMap */}
        <Stack.Screen name="SmallMap" component={SmallMap} />
        <Stack.Screen name="MaplePlant" component={MaplePlant} />
        <Stack.Screen name="PinePlant" component={PinePlant} />
        <Stack.Screen name="BirchPlant" component={BirchPlant} />
        <Stack.Screen name="CedarPlant" component={CedarPlant} />
        <Stack.Screen name="KudzuPlant" component={KudzuPlant} />
        <Stack.Screen name="KnotweedPlant" component={KnotweedPlant} />
        <Stack.Screen name="MustardPlant" component={MustardPlant} />
        <Stack.Screen name="PurplePlant" component={PurplePlant} />
        <Stack.Screen name="HyacinthPlant" component={HyacinthPlant} />
        <Stack.Screen name="OakPlant" component={OakPlant} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;