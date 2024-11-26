import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView, // Import ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import registerStyles from '@/app/styles/patient/register'; // Import the styles from registerStyles.ts
import { register, RegisterRequest } from "@/app/api/registerPatient"; // Ensure correct import path

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the register button
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [errorText, setErrorText] = useState(''); // State for error messages
  const router = useRouter();
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

  const handleRegister = async () => {
    // Clear any previous error message
    setErrorText('');
    setLoading(true); // Start loading

    // Construct the user data for registration
    const userData: RegisterRequest = {
      auth_details: {
        email,
        password,
        user_type: 'patient',
        auth_type: 'local',
      },
      profile_details: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        practitioner_type: 'general', // Modify as needed
        is_verified: false, // Set default value or modify as needed
        is_available: true, // Set default value or modify as needed
        user_type: 'patient',
      },
    };

    try {
      const response = await register(userData);
      console.log('Registration successful:', response.message);
      setLoading(false); // Stop loading
      router.push('./app'); // Navigate to the app after successful registration
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      setLoading(false); // Stop loading
      setErrorText(error.message || 'Something went wrong!'); // Show error message on failure
    }
  };

  return (
    <LinearGradient
      colors={['#00CDF9', '#FFFFFF']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={registerStyles.gradientContainer}
    >
      <ScrollView contentContainerStyle={registerStyles.scrollViewContainer}> {/* Wrap everything inside ScrollView */}
        <Animated.View
          style={[registerStyles.container, { transform: [{ translateX: slideAnim }] }]}
        >
          <Text style={registerStyles.title}>Sign up as Patient</Text>

          {/* Social Media Icons */}
          <View style={registerStyles.socialIcons}>
            <Image source={require('../../assets/facebook.png')} style={registerStyles.icon} />
            <Image source={require('../../assets/google.png')} style={registerStyles.icon} />
            <Image source={require('../../assets/apple.png')} style={registerStyles.icon} />
          </View>

          {/* Input Fields */}
          <TextInput
            style={registerStyles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            keyboardType="email-address"
            placeholderTextColor="#706d6d"
          />

          <TextInput
            style={registerStyles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            keyboardType="email-address"
            placeholderTextColor="#706d6d"
          />

          <TextInput
            style={registerStyles.input}
            placeholder="Enter your Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#706d6d"
          />

          <TextInput
            style={registerStyles.input}
            placeholder="Enter your Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#706d6d"
          />

          <TextInput
            style={registerStyles.input}
            placeholder="Enter your Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#706d6d"
          />

          {/* Error Message */}
          {errorText ? (
            <Text style={registerStyles.errorText}>{errorText}</Text>
          ) : null}

          {/* Sign Up Button */}
          <TouchableOpacity onPress={handleRegister} style={registerStyles.signUpButton}>
            <Text style={registerStyles.signUpText}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={registerStyles.loginContainer}>
            <Text
              onPress={() => router.push('./login')}
              style={registerStyles.loginText}
            >
              Already a user? Login
            </Text>
          </TouchableOpacity>

          <Text style={registerStyles.terms}>
            By Using This App, You Agree To The App's Terms And Conditions.
          </Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
