import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated, // Import Animated API
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/healthworker/otp";
import { verifyOtp, requestNewOtp } from "../../api/otp"; // Import API functions

interface UserData {
  auth_details: {
    email: string;
    password: string;
    user_type: string;
    auth_type: string;
  };
  profile_details: {
    first_name: string;
    last_name: string;
    phone_number: string;
    practitioner_type: string;
    is_verified: boolean;
    is_available: boolean;
    user_type: string;
  };
}

const Otp: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(""); // OTP input state
  const [loading, setLoading] = useState(false); // Loader state for submission
  const [errorText, setErrorText] = useState(""); // Error message
  const [successText, setSuccessText] = useState(""); // Success message
  const [countdown, setCountdown] = useState(120); // Countdown timer state (in seconds)
  const timer = useRef<NodeJS.Timeout | null>(null); // Using useRef to store the timer

  const slideAnim = useRef(new Animated.Value(-500)).current; // Slide from the top

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

  // Slide-in animation on component mount
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle OTP submission
  const handleSubmit = async () => {
    setLoading(true); // Start loading
    setErrorText(""); // Clear previous errors
    setSuccessText(""); // Clear previous success messages
    if (!otp) {
      setErrorText("Please enter a valid OTP");
      setLoading(false); // Stop loading
      return;
    }

    try {
      const [userPwd, userDataString] = await AsyncStorage.multiGet(["user_pwd", "userData"]);
      const user_pwd = userPwd[1]; // `user_pwd` value
      const userData: UserData | null = userDataString[1] ? JSON.parse(userDataString[1]) : null;

      if (user_pwd && userData) {
        const response = await verifyOtp(otp, user_pwd); // Call the API function
        console.log("Verification successful:", response);

        setSuccessText(
          response.message || "Verification successful! User registered successfully"
        ); // Show success message

        // Update the userData to set is_verified = true
        userData.profile_details.is_verified = true;

        // Save the updated userData back to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        setLoading(false); // Stop loading
        setTimeout(() => router.push("./login"), 2000); // Navigate to the login screen after 2 seconds
      } else {
        setLoading(false);
        setErrorText("No user data or password found.");
      }
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        console.error("Error submitting OTP:", error.message);
        setErrorText("Please enter a valid OTP");
      } else {
        console.error("Unknown error:", error);
        setErrorText("Something went wrong! Please try again.");
      }
    }
  };

  // Handle requesting a new OTP
  const handleRequestNewOtp = async () => {
    setLoading(true); // Start loading
    setErrorText(""); // Clear previous errors
    setSuccessText(""); // Clear previous success messages

    try {
      const userDataString = await AsyncStorage.getItem("userData");
      const userData: UserData | null = userDataString ? JSON.parse(userDataString) : null;

      if (userData) {
        const response = await requestNewOtp(userData.auth_details.email); // Call the API function
        console.log("New OTP requested successfully:", response);

        setSuccessText(response.message || "New OTP sent successfully!"); // Show success message
        resetCountdown(); // Reset the countdown timer to 120 seconds
      } else {
        setErrorText("No user data found.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error requesting new OTP:", error.message);
        setErrorText(error.message || "Something went wrong! Please try again.");
      } else {
        console.error("Unknown error:", error);
        setErrorText("Something went wrong! Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
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
            keyboardType="phone-pad"
            value={otp}
            onChangeText={setOtp}
          />

          {/* Countdown timer always displayed in min:secs format */}
          <Text style={styles.countdownText}>
            {countdown > 0
              ? `Resend OTP in ${formatCountdown(countdown)}`
              : "You can resend OTP now"}
          </Text>

          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <Text style={styles.otp}>Submit</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="blue" style={styles.loader} />}
          {errorText && <Text style={styles.errorText}>{errorText}</Text>}
          {successText && <Text style={styles.successText}>{successText}</Text>}

          {/* Show the resend button only after the countdown reaches 0 */}
          {countdown === 0 && (
            <TouchableOpacity onPress={handleRequestNewOtp} style={styles.resendButton}>
              <Text style={styles.resendText}>Request a new OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default Otp;
