import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { useRouter } from 'expo-router';
import * as Font from 'expo-font'; // Import the font module

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false); // State for loading fonts

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

  const handleLogin = () => {
    console.log('Logging in:', email, password);
    router.push('./app');
  };

  return (
    <LinearGradient
      colors={['#FFB815', '#FFFFFF']} // Blue to white gradient
      start={{ x: 0.5, y: 0 }} // Start from the top-center
      end={{ x: 0.5, y: 1 }} // End at the bottom-center
      style={styles.gradientContainer}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.title}>Login as Patient</Text>

        {/* Social Media Icons */}
        <View style={styles.socialIcons}>
          <Image source={require('../../assets/facebook.png')} style={styles.icon} />
          <Image source={require('../../assets/google.png')} style={styles.icon} />
          <Image source={require('../../assets/apple.png')} style={styles.icon} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#706d6d"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#706d6d"
        />

        <View style={styles.row}>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
          <Text style={styles.signInText}>Login</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity
          onPress={() => router.push('./register')}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>Register as New User</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By Using This App, You Agree To The App's Terms And Conditions.
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF', // Adjust for better contrast on blue gradient
    marginBottom: 50,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  input: {
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'poppins',
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    fontFamily: 'poppins',
  },
  forgotPassword: {
    color: '#5c5a5a',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontFamily: 'poppins',
  },
  signInButton: {
    backgroundColor: '#FAD02E',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  signInText: {
    color: '#5c5a5a',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  registerLink: {
    marginTop: 30,
  },
  registerText: {
    color: 'black',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'poppins',
  },
  terms: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
  },
});
