import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Font from 'expo-font'; // Import expo-font
import DoctorDashboard from './home';
import AppointmentsScreen from './appointments';
import NotificationsScreen from './notification';
import BioPage from './bio';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Welcome Screen Component
// function WelcomeScreen() {
//   const fadeAnim = useRef(new Animated.Value(0)).current; // Start with opacity 0

//   useEffect(() => {
//     // Start the fade-in animation
//     Animated.timing(fadeAnim, {
//       toValue: 1, // Fully visible
//       duration: 4000, // Duration of the animation
//       useNativeDriver: true, // Use native driver for better performance
//     }).start();
//   }, []);

//   return (
//     <View style={styles.welcomeContainer}>
//       <Animated.Image
//         source={require('../../assets/logo.png')} // Replace with your image path
//         style={[styles.logo, { opacity: fadeAnim }]} // Fade-in animation
//       />
//     </View>
//   );
// }

// Tabs Navigation Component
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

          return (
            <Ionicons
              name={iconName ?? 'home-outline'}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        headerShown: false,
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={DoctorDashboard} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={BioPage} />
    </Tab.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start with opacity 0


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
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.welcomeContainer}>
      <Animated.Image
        source={require('../../assets/logo.png')} // Replace with your image path
        style={[styles.logo, { opacity: fadeAnim }]} // Fade-in animation
      />
    </View>
    );
  }

  // if (showWelcome) {
  //   return <WelcomeScreen />;
  // }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen name="Bio" component={BioPage} />
    </Stack.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    marginBottom: 20, // Add spacing between the image and the loader
  },
});

export default AppNavigator;
