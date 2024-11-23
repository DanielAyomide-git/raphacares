import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter(); // Initialize router for navigation
  const slideAnim = useRef(new Animated.Value(500)).current;

  // Load Poppins font
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();

    // Slide animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!fontsLoaded) {
    return null; // Show a loading screen if fonts aren't loaded yet
  }

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // Handle registration logic
    console.log('Register:', email, password, phoneNumber);
  };

  return (
    <LinearGradient
      colors={['#FFB815', '#FFFFFF']} // Blue to white gradient
      start={{ x: 0.5, y: 0 }}        // Start at the top-center
      end={{ x: 0.5, y: 1 }}          // End at the bottom-center
      style={styles.gradientContainer}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.title}>Sign up as Patient</Text>

        {/* Social Media Icons */}
        <View style={styles.socialIcons}>
          <Image source={require('../../assets/facebook.png')} style={styles.icon} />
          <Image source={require('../../assets/google.png')} style={styles.icon} />
          <Image source={require('../../assets/apple.png')} style={styles.icon} />
        </View>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Enter your Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#706d6d"
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginContainer}>
          <Text
            onPress={() => router.push('./login')}
            style={styles.loginText}
          >
            Already a user? Login
          </Text>
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
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF', // Adjusted for contrast on gradient
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
    fontFamily: 'Poppins',
  },
  loginContainer: {
    marginTop: 30,
  },
  loginText: {
    fontFamily: 'Poppins',
    color: 'black',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: '#FAD02E',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  signUpText: {
    fontFamily: 'Poppins-Bold',
    color: '#5c5a5a',
    fontSize: 18,
    textAlign: 'center',
  },
  terms: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
  },
});
