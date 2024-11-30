// Otp.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import styles from '../../styles/healthworker/otp';
import { verifyOtp, requestNewOtp } from "../../api/otp"; // Import API functions

const Otp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(""); // OTP input state
  const [loading, setLoading] = useState(false); // Loader state for submission
  const [errorText, setErrorText] = useState(""); // Error message
  const [countdown, setCountdown] = useState(120); // Countdown timer state (in seconds)
  const timer = useRef<NodeJS.Timeout | null>(null); // Using useRef to store the timer

  // Function to clear and reset the countdown timer
  const resetCountdown = () => {
    if (timer.current) {
      clearInterval(timer.current); // Clear any existing interval
    }
    setCountdown(120); // Reset the countdown to 120 seconds
  };

  // Convert countdown to minutes and seconds
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`; // Format as min:secs
  };

  // Decrement the countdown every second
  useEffect(() => {
    if (countdown > 0) {
      timer.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      if (timer.current) {
        clearInterval(timer.current);
      }
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current); // Cleanup the interval on component unmount
      }
    };
  }, [countdown]);

  // Handle OTP submission
  const handleSubmit = async () => {
    setLoading(true); // Start loading
    setErrorText(""); // Clear previous errors

    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const userData = JSON.parse(storedData);
        const response = await verifyOtp(otp, userData.auth_details.password); // Call the API function
        console.log("Verification successful:", response);

        // Update the userData to set is_verified = true
        userData.is_verified = true;

        // Save the updated userData back to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        setLoading(false); // Stop loading
        router.push("./healthWorker"); // Navigate to the healthWorker screen
      } else {
        setLoading(false);
        setErrorText("No user data found.");
      }
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        console.error("Error submitting OTP:", error.message);
        setErrorText(`Something went wrong! ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        setErrorText("Something went wrong! Please try again.");
      }
    }
  };

  // Handle requesting a new OTP
  const handleRequestNewOtp = async () => {
    setLoading(true); // Start loading
    setErrorText(""); // Clear the error message

    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const userData = JSON.parse(storedData);
        const response = await requestNewOtp(userData.auth_details.email); // Call the API function
        console.log("New OTP requested successfully:", response);
        resetCountdown(); // Reset the countdown timer to 120 seconds
      } else {
        setErrorText("No user data found.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error requesting new OTP:", error.message);
        setErrorText(`Something went wrong! ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        setErrorText("Something went wrong! Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.text}>A six-digit OTP was sent to your email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />

          {/* Countdown timer always displayed in min:secs format */}
          <Text style={styles.countdownText}>
            {countdown > 0 ? `Resend OTP in ${formatCountdown(countdown)}` : "You can resend OTP now"}
          </Text>

          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text style={styles.otp}>Submit</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="blue" style={styles.loader} />}
          {errorText && <Text style={styles.errorText}>{errorText}</Text>}

          {/* Show the resend button only after the countdown reaches 0 */}
          {countdown === 0 && (
            <TouchableOpacity onPress={handleRequestNewOtp} style={styles.resendButton}>
              <Text style={styles.resendText}>Request a new OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Otp;
