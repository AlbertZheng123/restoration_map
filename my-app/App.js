// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavBar from './Components/BottomNavbar.js'; // Import the BottomNavBar

const App = () => {
  return (
    <NavigationContainer>
      <BottomNavBar />
    </NavigationContainer>
  );
}

export default App;