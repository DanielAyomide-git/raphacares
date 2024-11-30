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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../api/config"; // Assuming this is your API base URL
import {jwtDecode} from "jwt-decode";
import styles from "../../styles/patient/home";

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
  const [patientName, setPatientName] = useState<string>("");
  const [patientAvatar, setPatientAvatar] = useState<string>("");

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

  const fetchPatientData = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      // Decode the token (Assume JWT format for decoding)
      const decodedToken = jwtDecode(token) as { profile_id: string };
      const { profile_id } = decodedToken;

      const response = await fetch(`${API_BASE_URL}/patients/${profile_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }

      const data = await response.json();
      if (data.status === "success" && data.data) {
        // Combine first_name and last_name into a full name
        const fullName = `${data.data.first_name} ${data.data.last_name}`;
        setPatientName(fullName);
        setPatientAvatar(data.data.avatar_url); // Assuming avatar URL is in the response
      } else {
        throw new Error("Patient data not found");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchPatientData();
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
          <Text style={styles.nameText}>{patientName || "Loading..."}</Text>
        </View>
        <Image
          source={{ uri: patientAvatar || "https://i.pravatar.cc/300?u=po" }}
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
          <Text style={styles.doctorName}>Dr. Indah Kusumaningrum</Text>
        </View>
      </View>
    </Animated.ScrollView>
  );
}
