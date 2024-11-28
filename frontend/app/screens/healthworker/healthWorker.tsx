import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import { styles } from "@/app/styles/healthworker/login";
import { Picker } from "@react-native-picker/picker";
import { loginApi } from "@/app/api/login";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [practitionerType, setPractitionerType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>(""); // Error state for messages
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
    setError(""); // Clear previous errors

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!practitionerType) {
      setError("Please select your user type.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginApi(email, password, practitionerType);

      if (response?.status === 200) {
        router.push("./app");
      } else {
        setError(response?.data?.message || "Invalid credentials.");
      }
    } catch (error: any) {
      setError(
        error instanceof Error ? error.message : "Invalid credentials"
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
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

          <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.signInText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            onPress={() => router.push("./registerHealth")}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>Register as New User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("./resetPassword")}
            style={styles.resetPassword}
          >
            <Text style={styles.resetPasswordText}>Reset Password</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By Using This App, You Agree To The App's Terms And Conditions.
          </Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
