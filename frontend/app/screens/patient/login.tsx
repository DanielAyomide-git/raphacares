import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView, // Import ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { useRouter } from 'expo-router';
import * as Font from 'expo-font'; // Import the font module
import loginStyles from '@/app/styles/patient/login'; // Import the styles from loginStyles.ts
import { loginApi } from "@/app/api/login"; // Import login API function

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false); // State for loading fonts
  const [loading, setLoading] = useState(false); // Loading state for the login button
  const [error, setError] = useState(''); // Error message state for login

  const router = useRouter(); // Initialize router for navigation
  const slideAnim = useRef(new Animated.Value(500)).current; // Initial position off-screen (500px to the right)

  // Load fonts using useEffect
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'poppins': require('../../assets/fonts/Poppins-Regular.ttf'),
        'poppins-bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'poppins-Extrabold': require('../../assets/fonts/Poppins-ExtraBold.ttf'),
      });
      setFontsLoaded(true); // Update state once fonts are loaded
    };
    loadFonts();
  }, []);

  // Trigger the sliding animation when the component mounts
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Move to the final position (0)
      duration: 500, // Slide duration in milliseconds
      useNativeDriver: true, // Use native driver for smoother performance
    }).start();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(''); // Reset any previous errors
    try {
      // Call the login API function
      const response = await loginApi(email, password, 'patient');
      
      // If login is successful, navigate to the dashboard or another screen
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        router.push('./app');
      } else {
        // Handle unsuccessful login
        setError('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      // Handle any error from the API
      setError(error.message || 'Login failed. Invalid Credentials.');
    } finally {
      setLoading(false); // Stop loading once the API request is finished
    }
  };

  return (
    <LinearGradient
      colors={['#00CDF9', '#FFFFFF']} // Blue to white gradient
      start={{ x: 0.5, y: 0 }} // Start from the top-center
      end={{ x: 0.5, y: 1 }} // End at the bottom-center
      style={loginStyles.gradientContainer}
    >
      {/* Wrap everything inside ScrollView to make it scrollable */}
      <ScrollView contentContainerStyle={loginStyles.scrollViewContainer}>
        <Animated.View
          style={[loginStyles.container, { transform: [{ translateX: slideAnim }] }]}
        >
          <Text style={loginStyles.title}>Login as Patient</Text>

          {/* Social Media Icons */}
          <View style={loginStyles.socialIcons}>
            <Image source={require('../../assets/facebook.png')} style={loginStyles.icon} />
            <Image source={require('../../assets/google.png')} style={loginStyles.icon} />
            <Image source={require('../../assets/apple.png')} style={loginStyles.icon} />
          </View>

          <TextInput
            style={loginStyles.input}
            placeholder="Enter your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#706d6d"
          />

          <TextInput
            style={loginStyles.input}
            placeholder="Enter your Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#706d6d"
          />

          <View style={loginStyles.row}>
            <TouchableOpacity>
              <Text style={loginStyles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogin} style={loginStyles.signInButton}>
            <Text style={loginStyles.signInText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {error ? (
            <Text style={loginStyles.errorText}>{error}</Text>
          ) : null}

          {/* Register Link */}
          <TouchableOpacity
            onPress={() => router.push('./register')}
            style={loginStyles.registerLink}
          >
            <Text style={loginStyles.registerText}>Register as New User</Text>
          </TouchableOpacity>

          <Text style={loginStyles.terms}>
            By Using This App, You Agree To The App's Terms And Conditions.
          </Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
