import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import indexStyles from "./styles";

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Animation value for sliding
  const translateXAnim = useRef(new Animated.Value(1000)).current;

  // Array of background images
  const backgroundImages = [
    require("./assets/indexbg.jpeg"),
    require("./assets/drugs.jpg"),
    require("./assets/dpatient.jpeg"),
    require("./assets/consult.jpg"),
  ];

  // Preload custom fonts
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        poppins: require("./assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("./assets/fonts/Poppins-Bold.ttf"),
        "poppins-Extrabold": require("./assets/fonts/Poppins-ExtraBold.ttf"),
        "poppins-Semibold": require("./assets/fonts/Poppins-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  // Handle splash screen animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Cycle through background images every 3 seconds with sliding animation
  useEffect(() => {
    const imageTimer = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
      const direction = nextIndex % 2 !== 0 ? 1000 : -1000; // Alternate slide direction

      // Reset animation position and trigger the slide-in animation
      translateXAnim.setValue(direction);
      Animated.timing(translateXAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();

      setCurrentImageIndex(nextIndex);
    }, 3000);

    return () => clearInterval(imageTimer);
  }, [currentImageIndex, translateXAnim, backgroundImages.length]);

  if (!fontsLoaded) {
    return (
      <View style={indexStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#00CDF9" />
      </View>
    );
  }

  if (isSplashVisible) {
    return (
      <View style={indexStyles.splashContainer}>
        <Image
          source={require("./assets/logo.png")}
          style={indexStyles.logo}
        />
      </View>
    );
  }

  return (
    <View style={indexStyles.container}>
      <Animated.View
        style={[
          indexStyles.animatedBackground,
          { transform: [{ translateX: translateXAnim }] },
        ]}
      >
        <ImageBackground
          source={backgroundImages[currentImageIndex]}
          style={indexStyles.background}
        >
          </ImageBackground>
      </Animated.View>

      <View style={indexStyles.questionContainer}>
        <Text style={indexStyles.questionText}>Are you a </Text>
        <Text style={indexStyles.questionText}>health worker?</Text>
        <View style={indexStyles.buttonRow}>
          <TouchableOpacity
            style={indexStyles.buttonYes}
            onPress={() => router.push("./screens/healthworker/healthWorker")}
          >
            <Text style={indexStyles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={indexStyles.buttonNo}
            onPress={() => router.push("./screens/patient/login")}
          >
            <Text style={indexStyles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default App;
