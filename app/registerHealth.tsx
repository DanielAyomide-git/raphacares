import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; // Import the Picker component

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [category, setCategory] = useState(''); // State for selected category
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter(); // Initialize router for navigation
  const slideAnim = useRef(new Animated.Value(500)).current;

  // Load Poppins font
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require('../assets/fonts/Poppins-Regular.ttf'), // Adjust path as per your project structure
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'), // For bold text
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
    console.log('Register:', email, password, phoneNumber, category);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.title}>Sign up as Health Worker</Text>

      {/* Social Media Icons */}
      <View style={styles.socialIcons}>
        <Image source={require('../assets/facebook.png')} style={styles.icon} />
        <Image source={require('../assets/google.png')} style={styles.icon} />
        <Image source={require('../assets/apple.png')} style={styles.icon} />
      </View>


{/* Dropdown for Category Selection */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Doctor" value="doctor" />
          <Picker.Item label="Nurse" value="nurse" />
          <Picker.Item label="Community Health Worker" value="community_health_worker" />
        </Picker>
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
        <Text onPress={() => router.push('/loginHealth')} style={styles.loginText}>
          Already a user? Login
        </Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By Using This App, You Agree To The App's Terms And Conditions.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#9F9F9F',
    marginBottom: 30,
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
    fontFamily: 'Poppins', // Use Poppins font
  },
  pickerContainer: {
    width: '80%',
    marginBottom: 20,
    textAlign: 'center',

    
  },
  pickerLabel: {
    fontFamily: 'Poppins',
    color: '#706d6d',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',

    
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#00CDF9',
    borderRadius: 25,
    textAlign: 'center',
    fontFamily: 'Poppins',
    color: '#706d6d',

  },
  loginText: {
    fontFamily: 'Poppins',
    color: '#00CDF9',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginContainer: {
    marginTop: 30, 
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
    fontFamily: 'Poppins',
    color: '#00CDF9',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
  },
});
