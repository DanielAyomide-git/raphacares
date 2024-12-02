import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { register, RegisterRequest } from "@/app/api/register"; // Ensure correct import path
import { styles } from "@/app/styles/healthworker/register";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [category, setCategory] = useState(""); // For practitioner type
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [errorText, setErrorText] = useState(""); // State for error messages
  const [successText, setSuccessText] = useState(""); // State for success messages

  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
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
    return null;
  }

  const handleRegister = async () => {
  setErrorText(""); // Clear previous errors
  setSuccessText(""); // Clear previous success messages

  if (!category) {
    setErrorText("Please select a category");
    return;
  }
  
  if (!firstName) {
    setErrorText("Please enter your first name");
    return;
  }
  if (!lastName) {
    setErrorText("Please enter your last namee select a category");
    return;
  }
  if (!email) {
    setErrorText("Please enter your email");
    return;
  }
  if (!password) {
    setErrorText("Please enter your Password");
    return;
  }

  const userData: RegisterRequest = {
    auth_details: {
      email,
      password,
      user_type: "medical_practitioner",
      auth_type: "local",
    },
    profile_details: {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      practitioner_type: category,
      is_verified: false,
      is_available: true,
      user_type: "medical_practitioner",
    },
  };

  setLoading(true);

  try {
    const response = await register(userData);

    // Use only the backend's success message
    setSuccessText(response.message);

    // Save user data and password separately in AsyncStorage
    await AsyncStorage.multiSet([
      ["userData", JSON.stringify(userData)],
      ["user_pwd", password],
    ]);

    console.log("Saved user data and password successfully.");
    setLoading(false); // Stop loading

    // Redirect to OTP page after 2 seconds
    setTimeout(() => {
      router.push("./otp");
    }, 2000);
  } catch (error: any) {
    setLoading(false);

    // Extract and display backend error message
    const errorMessage =
      error?.detail || // Use backend-provided error detail (if available)
      error?.message || // Use a generic error message if provided
      "An unknown error occurred"; // Fallback error message

    setErrorText(errorMessage);
  }
};


  return (
    <LinearGradient
      colors={["#FFB815", "#FFFFFF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer} // Add this to style the scrollable content
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={styles.title}>Sign up as Health Worker</Text>
          <View style={styles.socialIcons}>
            <Image
              source={require("../../assets/facebook.png")}
              style={styles.icon}
            />
            <Image
              source={require("../../assets/google.png")}
              style={styles.icon}
            />
            <Image
              source={require("../../assets/apple.png")}
              style={styles.icon}
            />
          </View>
          {/* Category Dropdown */}
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
            placeholder="Enter your First Name"
            value={firstName}
            keyboardType="email-address"
            onChangeText={setFirstName}
            placeholderTextColor="#c9cacd"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your Last Name"
            keyboardType="email-address"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#c9cacd"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#c9cacd"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#c9cacd"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#c9cacd"
          />

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, loading && { backgroundColor: "#E0E0E0" }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#5c5a5a" />
            ) : (
              <Text style={styles.signUpText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Error Message */}
          {errorText ? (
            <Text style={styles.errorText}>{errorText}</Text>
          ) : null}

          {/* Success Message */}
          {successText ? (
            <Text style={styles.successText}>Redirecting...</Text>
          ) : null}

          <TouchableOpacity style={styles.loginContainer}>
            <Text onPress={() => router.push("./healthWorker")} style={styles.loginText}>
              Already a user? Login
            </Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By Using This App, You Agree To The App's Terms And Conditions.
          </Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
