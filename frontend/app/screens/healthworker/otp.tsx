import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const Otp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(""); // OTP input state
  const [loading, setLoading] = useState(false); // Loader state for submission

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

  // Handle OTP submission
  const handleSubmit = () => {
    setLoading(true); // Start loading
    setTimeout(() => {
      setLoading(false); // Stop loading after a simulated delay
      router.push("./newPassword"); // Navigate to newPassword screen
    }, 2000); // Simulate a delay of 2 seconds for OTP validation or submission
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.title}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#aaa"
            keyboardType="numeric" // Set keyboard type to numeric for OTP input
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text style={styles.otp}>Submit</Text>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator size="large" color="blue" style={styles.loader} />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    flexGrow: 1, // Ensure it grows and scrolls when necessary
    justifyContent: "center", // Center vertically
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 14,
    color: "#333",
  },
  otp: {
    color: "blue",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  loader: {
    marginTop: 20,
  },
});

export default Otp;
