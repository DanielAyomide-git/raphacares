import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import * as Font from "expo-font"; // Import the font module
import { Picker } from "@react-native-picker/picker"; // Import the Picker component
import axios from "axios"; // Import axios for making API requests

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false); // State for checkbox
  const [fontsLoaded, setFontsLoaded] = useState(false); // State for loading fonts
  const [category, setCategory] = useState(""); // State for selected category
  const router = useRouter(); // Initialize router for navigation
  const slideAnim = useRef(new Animated.Value(500)).current; // Initial position off-screen (500px to the right)

  // Load fonts using useEffect
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        poppins: require("../assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"), // Adjust path to your Poppins font
        "poppins-Extrabold": require("../assets/fonts/Poppins-ExtraBold.ttf"), // Adjust path to your Poppins font
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
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        // Navigate to the appropriate page after successful login
        router.push("/healthworker/app");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      <Text style={styles.title}>Login as Health Worker</Text>

      {/* Social Media Icons */}
      {/* <View style={styles.socialIcons}>
        <Image source={require("../assets/facebook.png")} style={styles.icon} />
        <Image source={require("../assets/google.png")} style={styles.icon} />
        <Image source={require("../assets/apple.png")} style={styles.icon} />
      </View> */}

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
          <Picker.Item
            label="Community Health Worker"
            value="community_health_worker"
          />
        </Picker>
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
        onPress={() => router.push("/healthworker/registerHealth")}
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>Register as New User</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By Using This App, You Agree To The App's Terms And Conditions.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#9F9F9F",
    marginBottom: 30,
    textAlign: "center",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end", // Move content to the bottom
    alignItems: "center",
  },

  overlay: {
    position: "absolute", // Position overlay on top
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 255, 0.3)", // Blue overlay with 40% opacity
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
    fontFamily: "poppins", // Use Poppins font
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between", // Space between remember password and forgot password
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
    fontFamily: "poppins", // Use Poppins font
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20, // Adds some space between checkbox and forgot password
  },
  checkbox: {
    marginRight: 10,
    marginBottom: 20,
  },
  rememberText: {
    color: "#9F9F9F",
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "poppins", // Use Poppins font
  },
  forgotPassword: {
    color: "#5c5a5a",
    textDecorationLine: "underline",
    fontSize: 14,
    fontFamily: "poppins", // Use Poppins font
  },
  pickerContainer: {
    width: "80%",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerLabel: {
    fontFamily: "Poppins",
    color: "#706d6d",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#00CDF9",
    borderRadius: 25,
    textAlign: "center",
    fontFamily: "Poppins",
    color: "#706d6d",
  },
  signInButton: {
    backgroundColor: "#FAD02E",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  signInText: {
    color: "#5c5a5a",
    fontSize: 25,
    fontWeight: "regular",
    textAlign: "center",
    fontFamily: "poppins", // Use Poppins font
  },
  registerLink: {
    marginTop: 30,
  },
  registerText: {
    color: "#00CDF9",
    fontSize: 16,
    fontWeight: "regular",
    textDecorationLine: "underline",
    fontFamily: "poppins", // Use Poppins font
  },
  terms: {
    color: "#00CDF9",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
});
