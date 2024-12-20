import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Image,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PatientDashboard from './home';
import AppointmentsScreen from './appointments';
import NotificationsScreen from './notification';
import BioPage from './bio';
import Services from './services';
import HealthWorkerInfo from './healthWorkerInfo'; // Import the HealthWorkerInfo screen
import * as Font from 'expo-font'; // Import expo-font

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Welcome Screen with Fade Animation


// Tab Navigation
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Appointments') {
            iconName = 'stopwatch-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Notification') {
            iconName = 'notifications';
          }

          return <Ionicons name={iconName ?? 'home-outline'} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        headerShown: false,
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={PatientDashboard} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={BioPage} />
    </Tab.Navigator>
  );
}

// Stack for Services and HealthWorkerInfo
function ServicesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={Services}
        options={{ title: 'Available Services' }}
      />
      <Stack.Screen
        name="HealthWorkerInfo"
        component={HealthWorkerInfo}
        options={{ title: 'Health Worker Details' }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Load fonts
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require('../../assets/fonts/Poppins-Regular.ttf'), // Ensure this font exists in your project
      });
      setFontsLoaded(true);
    };

    loadFonts();
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000); // Show welcome screen for 3 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, []);


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen name="Bio" component={BioPage} />
      <Stack.Screen name="Services" component={Services} />
    </Stack.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'black',
    borderRadius: 20,
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 4,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 200, // Adjust the size of your logo
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20, // Add spacing between the image and the spinner
  },
});

export default AppNavigator;
