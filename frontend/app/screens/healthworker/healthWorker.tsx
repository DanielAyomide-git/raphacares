import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import { styles } from "@/app/styles/healthworker/login";
import { Picker } from "@react-native-picker/picker";
import { loginApi } from "@/app/api/login"; // Import login API function

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [practitionerType, setPractitionerType] = useState<string>(""); // State for user type selection
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
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

  // Handle Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    if (!practitionerType) {
      Alert.alert("Error", "Please select your user type.");
      return;
    }

    setIsLoading(true);

    try {
      // Call login API function
      const response = await loginApi(email, password, practitionerType);

      // Check if response status is 200 OK
      if (response?.status === 200) {
        Alert.alert("Success", "Login successful!");
        router.push("./app"); // Navigate to the app
      } else {
        Alert.alert("Error", response?.data?.message || "Invalid credentials.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error logging in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FFB815", "#FFFFFF"]}
      start={{ x: 0.5, y: -5 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.title}>Login as Health Worker</Text>

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

        {/* User Type Dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={practitionerType}
            onValueChange={(itemValue) => setPractitionerType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Doctor" value="doctor" />
            <Picker.Item label="Nurse" value="nurse" />
            <Picker.Item
              label="Community Health Worker"
              value="community_health"
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

        <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.signInText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity
          onPress={() => router.push("./registerHealth")}
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
