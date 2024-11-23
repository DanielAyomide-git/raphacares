import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [category, setCategory] = useState(""); // State for selected category
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(500)).current;

  // Load Poppins font
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
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
    return null;
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true); // Show loader

    const userData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      category: category,
    };

    try {
      // Make a POST request to the backend /register endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/register",
        userData
      );

      // Handle the response
      if (response.data.message === "User registered successfully") {
        Alert.alert("Success", "Registration successful");
        router.push("./healthworker/app"); // Redirect to login page
      } else {
        Alert.alert("Error", "Email already exists");
      }
    } catch (error) {
      // Handle error from backend
      console.error(error);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <LinearGradient
      colors={["#00CDF9", "#FFFFFF"]} // Blue to White gradient
      start={{ x: 0.5, y: 0 }}        // Start at the top-center
      end={{ x: 0.5, y: 1 }}          // End at the bottom-center
      style={styles.gradientContainer}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.title}>Sign up as Health Worker</Text>

        {/* Social Media Icons */}
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

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Enter your First Name"
          value={firstname}
          onChangeText={setFirstName}
          placeholderTextColor="#706d6d"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Last Name"
          value={lastname}
          onChangeText={setLastName}
          placeholderTextColor="#706d6d"
        />
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

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[
            styles.signUpButton,
            loading && { backgroundColor: "#E0E0E0" }, // Change background when loading
          ]}
          onPress={handleRegister}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#5c5a5a" />
          ) : (
            <Text style={styles.signUpText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginContainer}>
          <Text
            onPress={() => router.push("./healthWorker")}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFFFFF", // Text color for better contrast
    marginBottom: 30,
    textAlign: "center",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  input: {
    width: "80%",
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins",
  },
  loginText: {
    fontFamily: "Poppins",
    color: "black",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  loginContainer: {
    marginTop: 30,
  },
  signUpButton: {
    backgroundColor: "#FAD02E",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
    alignItems: "center",
  },
  signUpText: {
    fontFamily: "Poppins-Bold",
    color: "#5c5a5a",
    fontSize: 18,
    textAlign: "center",
  },
  terms: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});
