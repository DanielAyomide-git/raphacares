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
import { StyleSheet } from "react-native";

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Animation value for sliding
  const translateXAnim = useRef(new Animated.Value(1000)).current;

  // Array of background images
  const backgroundImages = [
    require("./assets/1.png"),
    require("./assets/3.png"),
    require("./assets/2.png"),
    require("./assets/4.png"),
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
      {/* Card for animated background */}
      <View style={indexStyles.card}>
        <Animated.View
          style={[
            indexStyles.animatedBackground,
            { transform: [{ translateX: translateXAnim }] },
          ]}
        >
          <ImageBackground
            source={backgroundImages[currentImageIndex]}
            style={indexStyles.background}
          ></ImageBackground>
       
       </Animated.View>
       </View>
      {/* Question container as a card */}
      <View style={indexStyles.questionCard}>
        <Text style={indexStyles.questionTexta}>Are you a </Text>
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

const indexStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",

  },
  // Card for the animated background
  card: {
    width: "100%",
    height: "70%",
    borderRadius: 18,
    marginBottom: 0,
    marginTop:50

   
  },
  animatedBackground: {
    position: "absolute",
    width: "100%",
    height: "50%",
    marginTop:150
 
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  // Question card with shadow
  questionCard: {
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // For Android shadow
    alignItems: "center",
    width: "90%",
    marginBottom: 5,
    marginTop:0
  },
  questionTexta: {
    fontSize: 18,
    fontFamily: "poppins-Semibold",
    color: "#333",
  },
  questionText: {
    fontSize: 18,
    fontFamily: "poppins-Semibold",
    color: "#333",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 15,
    
  },
  buttonYes: {
    backgroundColor: "#FFB815",
    paddingVertical: 10,
    paddingHorizontal: 50, // Reduced horizontal padding
    borderRadius: 40,
    marginBottom: 8,
    fontFamily: "poppins",
  },
  buttonNo: {
    backgroundColor: "#00CDF9",
    paddingVertical: 10,
    paddingHorizontal: 50, // Reduced horizontal padding
    borderRadius: 40,
    fontFamily: "poppins",
    marginBottom: 8,


  },
  buttonText: {
    fontSize: 16,
    fontFamily: "poppins",
    color: "white",
    textAlign: "center",
  },
  
});

export default App;
