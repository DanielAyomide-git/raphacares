import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router"; // Import expo-router for navigation
import * as Font from "expo-font"; // Import the font module

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true); // State for showing splash screen
  const [fontsLoaded, setFontsLoaded] = useState(false); // State for loading fonts
  const router = useRouter(); // useRouter to handle navigation
  const slideAnim = useRef(new Animated.Value(1000)).current; // Start off-screen (1000 pixels to the right)

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

  // Use useEffect to show the splash screen for 5 seconds, then start the slide animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false); // Hide splash screen after 5 seconds

      // Start the sliding animation when splash screen is hidden
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to its final position (0 offset)
        duration: 800, // Duration of the animation
        easing: Easing.ease, // Easing function for smooth animation
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [slideAnim]);

  // Show a loading indicator if fonts are not loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00CDF9" />{" "}
        {/* Loading spinner */}
      </View>
    );
  }

  // Splash screen with company logo
  if (isSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("../assets/RaphaCares-04.png")} // Replace with the path to your company logo
          style={styles.logo}
        />
      </View>
    );
  }

  // Index page with background and navigation buttons with slide-in animation
  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <ImageBackground
        source={require("../assets/indexbg.jpeg")} // Add correct path to your image
        style={styles.background}
        imageStyle={{ opacity: 1.5 }}
      >
        <View style={styles.container}>
          {/* Welcome Text */}
          {/* <Text style={styles.welcomeText}>WELCOME</Text> */}

          {/* Image of Doctors */}
          <Image
            source={require("../assets/logo.png")}
            style={styles.doctorImage}
          />

          {/* Question Section */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Are you a health worker?</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.buttonYes}
                onPress={() => router.push("/healthworker/healthWorker")} // Navigate to healthWorker.tsx
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonNo}
                onPress={() => router.push("/patient/login")} // Navigate to Register.tsx
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Background color while loading
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Optional: customize background color for the splash screen
  },
  logo: {
    width: 200, // Adjust logo size
    height: 200,
    resizeMode: "contain", // Ensure the logo fits well within the container
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end", // Move content to the bottom
    alignItems: "center",
  },
  animatedContainer: {
    flex: 1, // Animated container for sliding effect
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  welcomeText: {
    fontSize: 15,
    fontFamily: "poppins", // Use Poppins font
    color: "#00CDF9", // Changed the text color to blue
    marginVertical: 20,
    textAlign: "center",
  },
  doctorImage: {
    width: "65%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 100,
    marginTop: 50,
    borderRadius: 15, // Make corners rounded
    overflow: "hidden", // Ensure content respects the borderRadius
  },
  questionContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Make the container transparent
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20, // Adjust bottom margin to give space from the screen edge
  },
  questionText: {
    fontSize: 20,
    fontFamily: "poppins-extrabold", // Use Poppins font
    color: "white",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "80%",
  },
  buttonYes: {
    backgroundColor: "#00CDF9", // Changed button color to #00CDF9
    paddingVertical: 30, // Increased vertical padding
    paddingHorizontal: 70, // Increased horizontal padding
    borderRadius: 40, // Rounded edges
    marginHorizontal: 10,
    marginBottom: 10, // Add margin between buttons
  },
  buttonNo: {
    backgroundColor: "#FFB815", // Changed button color to #00CDF9
    paddingVertical: 30, // Increased vertical padding
    paddingHorizontal: 70, // Increased horizontal padding
    borderRadius: 40, // Rounded edges
    marginHorizontal: 10,
    marginBottom: 30, // Add margin between buttons
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "poppins", // Use Poppins font
    color: "white", // Keep button text white for contrast
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default App;
