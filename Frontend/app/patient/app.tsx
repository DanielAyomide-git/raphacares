import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DoctorDashboard from './home';
import MessagesScreen from './message';
import SettingsScreen from './setting';
import NotificationsScreen from './notification';
import ProfilePage from './profile';
import BioPage from './bio';
import Services from './services';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
      <Tab.Screen name="Home" component={DoctorDashboard} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen name="Bio" component={BioPage} />
      <Stack.Screen name="Services" component={Services} />
    </Stack.Navigator>
  );
}

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
});

export default AppNavigator;
