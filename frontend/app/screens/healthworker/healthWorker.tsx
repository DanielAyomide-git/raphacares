import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(500)).current;

  // Load fonts
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "poppins-Extrabold": require("../../assets/fonts/Poppins-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  // Slide animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true); // Show loader when login starts
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        router.push("./app");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in. Please try again.");
    } finally {
      setIsLoading(false); // Hide loader after login completes
    }
  };

  return (
    <LinearGradient
    colors={["#00CDF9", "#FFFFFF"]} // Blue at the top, white at the bottom
    start={{ x: 0.5, y: -5 }}        // Start from the top-center
    end={{ x: 1, y: 1 }}          // End at the bottom-center
    style={styles.gradientContainer}
  >

      <Animated.View
        style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.title}>Login as Health Worker</Text>

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

        {/* Login Button with Loader */}
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.signInButton}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" /> // Loader
          ) : (
            <Text style={styles.signInText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity
          onPress={() => router.push("/screens/healthworker/registerHealth")}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
  },
  forgotPassword: {
    color: "#5c5a5a",
    textDecorationLine: "underline",
    fontSize: 14,
    fontFamily: "poppins",
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
    fontFamily: "poppins",
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
    fontFamily: "poppins",
  },
  signInButton: {
    backgroundColor: "#FAD02E",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "#5c5a5a",
    fontSize: 25,
    fontWeight: "regular",
    textAlign: "center",
    fontFamily: "poppins",
  },
  registerLink: {
    marginTop: 30,
  },
  registerText: {
    color: "black",
    fontSize: 16,
    fontWeight: "regular",
    textDecorationLine: "underline",
    fontFamily: "poppins",
  },
  terms: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
});
