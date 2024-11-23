import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router"; 
import * as Font from "expo-font"; 
import indexStyles from "./styles";

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        poppins: require("./assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("./assets/fonts/Poppins-Bold.ttf"),
        "poppins-Extrabold": require("./assets/fonts/Poppins-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => clearTimeout(timer);
  }, [slideAnim]);

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
          source={require("./assets/RaphaCares-04.png")}
          style={indexStyles.logo}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        indexStyles.animatedContainer,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <ImageBackground
        source={require("./assets/indexbg.jpeg")}
        style={indexStyles.background}
        imageStyle={{ opacity: 1.5 }}
      >
        <View style={indexStyles.container}>
          <Image
            source={require("./assets/logo.png")}
            style={indexStyles.doctorImage}
          />
          <View style={indexStyles.questionContainer}>
            <Text style={indexStyles.questionText}>Are you a health worker?</Text>
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
      </ImageBackground>
    </Animated.View>
  );
};

export default App;
