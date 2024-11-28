import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { GradientBackground, styles } from "@/app/styles/healthworker/resetPassword";
import { requestResetToken } from "../../api/resetPassword"; 


const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for OTP request
  const [error, setError] = useState(""); // Error state for invalid email or API errors

  // Shared value for animation
  const translateY = useSharedValue(500); // Start off-screen (500px below)

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Trigger animation on mount
  useEffect(() => {
    translateY.value = withTiming(0, { duration: 500 }); // Slide to position over 500ms
  }, []);

  // Handle OTP request and API communication
  const handleOtpRequest = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError(""); // Clear previous error
    setLoading(true); // Start loading

    try {
      // Call the API function
      await requestResetToken(email); // API call to send OTP
      // If successful, navigate to the next screen
      router.push("./newPassword");
    } catch (err) {
      // Check if the error is an instance of Error
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false); // Stop loading after the API request is complete
    }
  };

  return (
    
    <View style={styles.container}>
          <GradientBackground>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity onPress={handleOtpRequest} disabled={loading}>
            <Text style={styles.otp}>Receive OTP</Text>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator size="large" color="blue" style={styles.loader} />
          )}
        </Animated.View>
      </ScrollView>
      </GradientBackground>

    </View>
  );
};

export default ResetPassword;
