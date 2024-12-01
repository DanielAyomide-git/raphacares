import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import registerStyles from '@/app/styles/patient/register';
import { register, RegisterRequest } from "@/app/api/registerPatient"; // Ensure correct import path

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState(''); // For success messages
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(500)).current;

  // Load Poppins font and apply slide animation
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();

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
    // Clear previous messages
    setErrorText('');
    setSuccessText('');
    setLoading(true);

    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      setLoading(false);
      setErrorText('All fields are required.');
      return;
    }

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
        practitioner_type: '', // Modify as needed
        is_verified: false,
        is_available: true,
        user_type: 'patient',
      },
    };

    try {
      const response = await register(userData);

      // Display success message
      setSuccessText(response.message);

      // Save user data and password in AsyncStorage
      await AsyncStorage.multiSet([
        ['userData', JSON.stringify(userData)],
        ['user_pwd', password],
      ]);

      console.log('User data saved to AsyncStorage.');

      setLoading(false);

      // Redirect to OTP page after a brief delay
      setTimeout(() => {
        router.push('./otp');
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      console.error('Registration failed:', error.message);
      setErrorText('User exists' );
    }
  };

  return (
    <LinearGradient
      colors={['#00CDF9', '#FFFFFF']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={registerStyles.gradientContainer}
    >
      <ScrollView contentContainerStyle={registerStyles.scrollViewContainer}>
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
            placeholderTextColor="#c9cacd"
          />

          <TextInput
            style={registerStyles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#c9cacd"
          />

          <TextInput
            style={registerStyles.input}
            placeholder="Enter your Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#c9cacd"
          />

          <TextInput
            style={registerStyles.input}
            placeholder="Enter your Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#c9cacd"
          />

          <TextInput
            style={registerStyles.input}
            placeholder="Enter your Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#c9cacd"
          />

          {/* Error Message */}
          {errorText ? <Text style={registerStyles.errorText}>{errorText}</Text> : null}

          {/* Success Message */}
          {successText ? (
            <Text style={registerStyles.successText}>Redirecting...</Text>
          ) : null}

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleRegister}
            style={[registerStyles.signUpButton, loading && { backgroundColor: '#E0E0E0' }]}
            disabled={loading}
          >
            <Text style={registerStyles.signUpText}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={registerStyles.loginContainer}>
            <Text onPress={() => router.push('./login')} style={registerStyles.loginText}>
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
