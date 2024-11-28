import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import styles from "../../styles/patient/home"

// Define navigation types
type RootStackParamList = {
  Services: { service: Service }; // Define the "Services" screen route params
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Services">;

// Define service type
type Service = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export default function PatientDashboard() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const welcomeX = useSharedValue(300); // Welcome text starts off-screen to the right
  const pageY = useSharedValue(300); // Page content starts off-screen at the bottom

  const servicesX = [
    useSharedValue(-300), // "Hospitals" slides in from the left
    useSharedValue(300), // "Drug refill" slides in from the right
    useSharedValue(-300), // "Ambulance" slides in from the left
    useSharedValue(300), // "Consultation" slides in from the right
  ];

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  // Show the welcome message for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      pageY.value = withTiming(0, { duration: 500 });
      servicesX.forEach((sharedValue, index) => {
        sharedValue.value = withDelay(index * 200, withTiming(0, { duration: 800 }));
      });
    }, 2000);

    welcomeX.value = withTiming(0, { duration: 1000 });

    return () => clearTimeout(timer);
  }, []);

  const welcomeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: welcomeX.value }],
  }));

  const pageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pageY.value }],
  }));

  const serviceStyles = servicesX.map((sharedValue) =>
    useAnimatedStyle(() => ({
      transform: [{ translateX: sharedValue.value }],
    }))
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    ); // Fallback view while fonts load
  }

  if (showWelcome) {
    return (
      <Animated.View style={[styles.welcomeContainer, welcomeStyle]}>
        <Text style={styles.welcomeTitle}>Welcome to Raphacare</Text>
      </Animated.View>
    );
  }

  const services: Service[] = [
    { id: "1", name: "Hospitals", icon: "bed-outline", color: "#4CAF50" },
    { id: "2", name: "Drug refill", icon: "flask-outline", color: "#2196F3" },
    { id: "3", name: "Ambulance", icon: "car-sport-outline", color: "#FF5722" },
    { id: "4", name: "Consultation", icon: "chatbubble-ellipses-outline", color: "#9C27B0" },
  ];

  return (
    <Animated.ScrollView style={[styles.container, pageStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.nameText}>Donna Troy</Text>
        </View>
        <Image
          source={{ uri: "https://i.pravatar.cc/300?u=po" }}
          style={styles.profileImage}
        />
      </View>

      {/* Free Consultation Card */}
      <View style={styles.consultationCard}>
        <Text style={styles.consultationText}>
          Get the best consultation from health professionals
        </Text>
        <TouchableOpacity style={styles.consultButton}>
          <Text style={styles.consultButtonText}>Find a doctor</Text>
        </TouchableOpacity>
      </View>

      {/* Services */}
      <Text style={styles.sectionTitle}>Our Services</Text>
      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <Animated.View
            key={service.id}
            style={[styles.serviceBox, { backgroundColor: service.color }, serviceStyles[index]]}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Services", { service })}
            >
              <Ionicons name={service.icon} size={40} color="white" />
              <Text style={styles.serviceText}>{service.name}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Appointment Section */}
      <Text style={styles.sectionTitle}>Appointments</Text>
      <View style={styles.appointmentCard}>
        <Text style={styles.appointmentTime}>08:00 - 09:00</Text>
        <Text style={styles.appointmentDate}>Wed, Jun 20</Text>
        <View style={styles.doctorInfo}>
          <Image
            source={{ uri: "https://bit.ly/dan-abramov" }}
            style={styles.doctorImage}
          />
          <Text style={styles.doctorName}>dr Indah Kusumaningrum</Text>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

