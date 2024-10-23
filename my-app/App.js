// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Platform } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import * as Device from 'expo-device';
// import BottomNavBar from './Components/BottomNavbar';
// import SmallMap from './Components/SmallMap';
// import OakPlant from './Components/Plants/Oak';
// import MaplePlant from './Components/Plants/MaplePlant';
// import PinePlant from './Components/Plants/PinePlant';
// import BirchPlant from './Components/Plants/BirchPlant';
// import CedarPlant from './Components/Plants/CedarPlant';
// import KudzuPlant from './Components/Plants/KudzuPlant';
// import KnotweedPlant from './Components/Plants/KnotweedPlant';
// import MustardPlant from './Components/Plants/MustardPlant';
// import PurplePlant from './Components/Plants/PurplePlant';
// import HyacinthPlant from './Components/Plants/Hyacinth';

// const Stack = createStackNavigator();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Time to check your plants! 🌱",
//       body: 'Don’t forget to take care of your plants!',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function scheduleDailyNotifications() {
//   const now = new Date();
//   const loginNotificationTime = new Date(now);
//   const sixHourNotificationTime = new Date(now);

//   // Set times for notifications
//   loginNotificationTime.setHours(now.getHours(), now.getMinutes() + 1); // 1 minute after login
//   sixHourNotificationTime.setHours(now.getHours() + 6, now.getMinutes());

//   // Schedule notification at login
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Welcome back! 🌿",
//       body: 'Check out what’s new in your plant collection!',
//     },
//     trigger: { date: loginNotificationTime },
//   });

//   // Schedule notification every 6 hours
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Time to check your plants! 🌱",
//       body: 'It’s been a while, how are your plants doing?',
//     },
//     trigger: {
//       hour: sixHourNotificationTime.getHours(),
//       minute: sixHourNotificationTime.getMinutes(),
//       repeats: true,
//     },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     try {
//       const projectId = Constants.expoConfig.extra.eas.projectId || Constants.easConfig.projectId;
//       if (!projectId) {
//         throw new Error('Project ID not found');
//       }
//       token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
//       console.log(token);
//     } catch (e) {
//       token = `${e}`;
//     }
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }
//   return token;
// }

// const App = () => {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       console.log('Notification received:', notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log('Notification response:', response);
//     });

//     // Schedule notifications when the app starts (or when the user logs in)
//     scheduleDailyNotifications();

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current);
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Main" component={BottomNavBar} options={{ headerShown: false }} />
//         <Stack.Screen name="SmallMap" component={SmallMap} />
//         <Stack.Screen name="MaplePlant" component={MaplePlant} />
//         <Stack.Screen name="PinePlant" component={PinePlant} />
//         <Stack.Screen name="BirchPlant" component={BirchPlant} />
//         <Stack.Screen name="CedarPlant" component={CedarPlant} />
//         <Stack.Screen name="KudzuPlant" component={KudzuPlant} />
//         <Stack.Screen name="KnotweedPlant" component={KnotweedPlant} />
//         <Stack.Screen name="MustardPlant" component={MustardPlant} />
//         <Stack.Screen name="PurplePlant" component={PurplePlant} />
//         <Stack.Screen name="HyacinthPlant" component={HyacinthPlant} />
//         <Stack.Screen name="OakPlant" component={OakPlant} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import BottomNavBar from './Components/BottomNavbar';
import SmallMap from './Components/SmallMap';
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
import InnerPolygonMap from './Components/InnerPolygonMap';
import InnerPolygonsSection from './Components/InnerPolygonsSection';
import ImpactDetails from './Components/ImpactDetails';
import InnerPolygonDetails from './Components/InnerPolygonDetails';
import BiomassOverlayPage from './Components/BiomassOverlayPage';

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to check your plants! 🌱",
      body: 'Don’t forget to take care of your plants!',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function scheduleDailyNotifications() {
  const now = new Date();
  const loginNotificationTime = new Date(now);
  const sixHourNotificationTime = new Date(now);

  // Set times for notifications
  loginNotificationTime.setHours(now.getHours(), now.getMinutes() + 1); // 1 minute after login
  sixHourNotificationTime.setHours(now.getHours() + 6, now.getMinutes());

  // Schedule notification at login
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Welcome back! 🌿",
      body: 'Check out what’s new in your plant collection!',
    },
    trigger: { date: loginNotificationTime },
  });

  // Schedule notification every 6 hours
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to check your plants! 🌱",
      body: 'It’s been a while, how are your plants doing?',
    },
    trigger: {
      hour: sixHourNotificationTime.getHours(),
      minute: sixHourNotificationTime.getMinutes(),
      repeats: true,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    try {
      const projectId = Constants.expoConfig.extra.eas.projectId || Constants.easConfig.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    // Schedule notifications when the app starts (or when the user logs in)
    scheduleDailyNotifications();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2d3e34', // Black-ish green color
          },
          headerTintColor: '#fff', // White text for header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Main" component={BottomNavBar} options={{ headerShown: false }} />
        <Stack.Screen name="SmallMap" component={SmallMap} options={{ title: 'Small Map' }} />
        <Stack.Screen name="MaplePlant" component={MaplePlant} options={{ title: 'Maple Plant' }} />
        <Stack.Screen name="PinePlant" component={PinePlant} options={{ title: 'Pine Plant' }} />
        <Stack.Screen name="BirchPlant" component={BirchPlant} options={{ title: 'Birch Plant' }} />
        <Stack.Screen name="CedarPlant" component={CedarPlant} options={{ title: 'Cedar Plant' }} />
        <Stack.Screen name="KudzuPlant" component={KudzuPlant} options={{ title: 'Kudzu Plant' }} />
        <Stack.Screen name="KnotweedPlant" component={KnotweedPlant} options={{ title: 'Knotweed Plant' }} />
        <Stack.Screen name="MustardPlant" component={MustardPlant} options={{ title: 'Mustard Plant' }} />
        <Stack.Screen name="PurplePlant" component={PurplePlant} options={{ title: 'Purple Plant' }} />
        <Stack.Screen name="HyacinthPlant" component={HyacinthPlant} options={{ title: 'Hyacinth Plant' }} />
        <Stack.Screen name="OakPlant" component={OakPlant} options={{ title: 'Oak Plant' }} />
        <Stack.Screen name="InnerPolygonMap" component={InnerPolygonMap} options={{ title: 'Inner Polygon Map' }} />
        <Stack.Screen name="InnerPolygonsSection" component={InnerPolygonsSection} options={{ title: 'Inner Polygon Section' }} />
        <Stack.Screen name="ImpactDetails" component={ImpactDetails} options={{ title: 'Impact Details' }} />
        <Stack.Screen name="InnerPolygonDetails" component={InnerPolygonDetails} options={{ title: 'Inner Polygon Details' }} />
        <Stack.Screen name="BiomassOverlayPage" component={BiomassOverlayPage} options={{ title: 'Biomass Heatmap' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;