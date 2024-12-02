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
import MessagesScreen from './message';
import SettingsScreen from './setting';
import NotificationsScreen from './notification';
import ProfilePage from './profile';
import BioPage from './bio';
import Services from './services';
import * as Font from 'expo-font'; // Import expo-font

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Welcome Screen with Fade Animation
function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start with opacity 0

  useEffect(() => {
    // Start the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fully visible
      duration: 2000, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, []);

  return (
    <View style={styles.welcomeContainer}>
      <Animated.Image
        source={require('../../assets/RaphaCares-04.png')} // Replace with the correct path to your logo
        style={[styles.logo, { opacity: fadeAnim }]} // Apply fade-in animation
      />
      <ActivityIndicator size="large" color="#0041F9" />
    </View>
  );
}

// Tab Navigation
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Messages') {
            iconName = 'chatbox-ellipses';
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
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
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
    }, 2000); // Show welcome screen for 2 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  if (showWelcome) {
    return <WelcomeScreen />;
  }

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
