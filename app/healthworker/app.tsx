import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import DoctorDashboard from './home';
import MessagesScreen from './message';
import SettingsScreen from './setting';
import NotificationsScreen from './notification';
import ProfilePage from './profile';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Set icon based on route name
          if (route.name === 'Home') {
            iconName = 'home-outline'; 
          } else if (route.name === 'Messages') {
            iconName = 'chatbox-ellipses'; 
          }
          else if (route.name === 'Messages') {
            iconName = 'chatbox-ellipses'; 
          }
          else if (route.name === 'Profile') {
            iconName = 'person'; 
          }
          else if (route.name === 'Notification') {
            iconName = 'notifications'; 
          }

          // Return icon component
          return <Ionicons name={iconName ?? 'home-outline'} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black', // Active icon color set to black
        tabBarInactiveTintColor: 'grey', // Inactive icon color set to grey
        headerShown: false, // Hide header for the tab navigator
        tabBarStyle: styles.tabBar, // Apply custom styles to the tab bar
      })}
    >
      <Tab.Screen name="Home" component={DoctorDashboard} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

// Styles for the tab container
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent', // Background color of the tab bar set to transparent
    borderTopWidth: 0, // Remove the border at the top
    height: 60, // Height of the tab bar
    paddingBottom: 5, // Padding for bottom of the tab bar
    elevation: 0, // Remove elevation for Android shadow
  },
});

export default MyTabs;
