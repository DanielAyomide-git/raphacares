// DoctorDashboard.tsx
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

export default function DoctorDashboard() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation<NavigationProp>();

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

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    ); // Fallback view while fonts load
  }

  const services: Service[] = [
    { id: "1", name: "Hospitals", icon: "bed-outline", color: "#4CAF50" },
    { id: "2", name: "Drug refill", icon: "flask-outline", color: "#2196F3" },
    { id: "3", name: "Ambulance", icon: "car-sport-outline", color: "#FF5722" },
    { id: "4", name: "Consultation", icon: "chatbubble-ellipses-outline", color: "#9C27B0" },
  ];

  return (
    <ScrollView style={styles.container}>
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
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[styles.serviceBox, { backgroundColor: service.color }]}
            onPress={() => navigation.navigate("Services", { service })}
          >
            <Ionicons name={service.icon} size={40} color="white" />
            <Text style={styles.serviceText}>{service.name}</Text>
          </TouchableOpacity>
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
    </ScrollView>
  );
}

// Styles unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#333",
  },
  nameText: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#007BFF",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  consultationCard: {
    backgroundColor: "#E9F7FF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  consultationText: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#007BFF",
    marginBottom: 10,
  },
  consultButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  consultButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 10,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  serviceBox: {
    width: "40%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  serviceText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "white",
    marginTop: 8,
    textAlign: "center",
  },
  appointmentCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  appointmentTime: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#007BFF",
    marginBottom: 5,
  },
  appointmentDate: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#555",
    marginBottom: 10,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  doctorName: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
});
