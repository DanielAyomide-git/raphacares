import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { GradientBackground, styles } from "@/app/styles/patient/resetPassword"; // Assuming styles are defined here
import { resetPassword } from "../../api/newPassword"; // Import the resetPassword API function

// Type for the error
type ErrorType = string | null;

const ResetPassword: React.FC = () => {
  const router = useRouter();
  
  // State hooks with types
  const [new_password, setNewPassword] = useState<string>(""); // State to hold the new password
  const [loading, setLoading] = useState<boolean>(false); // Loader state for submission
  const [otp, setOtp] = useState<string>(""); // OTP input state
  const [error, setError] = useState<ErrorType>(""); // Error state, can be a string or null

  // Shared value for animation
  const translateY = useSharedValue<number>(500); // Start off-screen (500px below)

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Trigger animation on mount
  useEffect(() => {
    translateY.value = withTiming(0, { duration: 500 }); // Slide to position over 500ms
  }, []);

  // Handle submit action and API communication
  const handleSubmit = async () => {
    if (!otp || !new_password) {
      setError("Please fill in both OTP and new password.");
      return;
    }

    setError(""); // Clear any previous error
    setLoading(true); // Start loading

    try {
      // Call the resetPassword API function
      await resetPassword(otp, new_password); // API call to reset password

      // If successful, show success alert and navigate to next screen
      Alert.alert("Success", "Password has been reset successfully.");
      router.push("./login"); // Navigate to the healthWorker screen
    } catch (error) {
      // Handle error safely
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Invalid OTP or Password too short");
      }
    } finally {
      setLoading(false); // Stop loading after the API request is complete
    }
  };

  return (
    <View style={styles.container}>
                <GradientBackground>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.title}>Enter OTP</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#aaa"
            value={otp}
            onChangeText={setOtp}
          />
          <Text style={styles.title}>Enter New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor="#aaa"
            value={new_password}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          {error && <Text style={styles.errorText}>{error}</Text>} {/* Show error message */}
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text style={styles.otp}>Submit</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="blue" style={styles.loader} />}
        </Animated.View>
      </ScrollView>
      </GradientBackground>

    </View>
  );
};

export default ResetPassword;
