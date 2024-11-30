import React, { useState, useRef, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import loginStyles from '@/app/styles/patient/login';
import { loginApi } from "@/app/api/login";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {jwtDecode} from 'jwt-decode'; // Import JWT decode

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'poppins': require('../../assets/fonts/Poppins-Regular.ttf'),
        'poppins-bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'poppins-Extrabold': require('../../assets/fonts/Poppins-ExtraBold.ttf'),
      });
      setFontsLoaded(true); 
    };
    loadFonts();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await loginApi(email, password, 'patient');
      
      if (response.status === 200) {
        const { access_token } = response.data;

        if (!access_token) {
          throw new Error('Access token missing in API response.');
        }

        // Save the access_token in AsyncStorage
        await AsyncStorage.setItem('access_token', access_token);

        // Decode the access token to extract user information
        const decoded: { user_id: string } = jwtDecode(access_token);

        // Store the user_id in AsyncStorage
        await AsyncStorage.setItem('user_id', decoded.user_id);

        // Navigate to the app's dashboard or home page
        router.push('./app');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Invalid Credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#00CDF9', '#FFFFFF']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={loginStyles.gradientContainer}
    >
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
            placeholderTextColor="#c9cacd"
          />

          <TextInput
            style={loginStyles.input}
            placeholder="Enter your Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#c9cacd"
          />

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
          
          <TouchableOpacity
            onPress={() => router.push('./resetPassword')}
            style={loginStyles.resetPassword}
          >
            <Text style={loginStyles.resetPasswordText}>Reset Password</Text>
          </TouchableOpacity>

          <Text style={loginStyles.terms}>
            By Using This App, You Agree To The App's Terms And Conditions.
          </Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
