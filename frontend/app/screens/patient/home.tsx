import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { API_BASE_URL } from "../../api/config";
import styles from "../../styles/patient/home";

// Define navigation types
type Service = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

type Appointment = {
  id: string;
  appointment_start_time: string;
  appointment_reason:string;
  appointment_status: string;
  appointment_end_time: string;
  medical_practitioner: {
    specialization: string;
    practitioner_type: string;
    name: string;
    profile_picture_url: string;

  
  };
};

export default function PatientDashboard() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [patientName, setPatientName] = useState<string>("");
  const [patientAvatar, setPatientAvatar] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const welcomeX = useSharedValue(300);
  const pageY = useSharedValue(300);

  const servicesX = [
    useSharedValue(-300),
    useSharedValue(300),
    useSharedValue(-300),
    useSharedValue(300),
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      pageY.value = withTiming(0, { duration: 500 });
      servicesX.forEach((sharedValue, index) => {
        sharedValue.value = withDelay(index * 200, withTiming(0, { duration: 800 }));
      });
    }, 0);

    welcomeX.value = withTiming(0, { duration: 1000 });

    return () => clearTimeout(timer);
  }, []);

  const fetchPatientData = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }

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
        const fullName = `${data.data.first_name} ${data.data.last_name}`;
        setPatientName(fullName);
        setPatientAvatar(data.data.profile_picture_url);
        fetchAppointments(profile_id, token);
      } else {
        throw new Error("Patient data not found");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (patientId: string, token: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments?patient_id=${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
  
      const data = await response.json();
      if (data.status === "success") {
        const appointmentPromises = data.data.map(async (appointment: any) => {
          // Fetch medical practitioner details
          const practitionerResponse = await fetch(
            `${API_BASE_URL}/medical_practitioners/${appointment.medical_practitioner_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          let practitioner = {
            name: "Unknown Practitioner",
            profile_picture_url: "https://via.placeholder.com/100",
            practitioner_type: "",
            specialization: "", // Add specialization with a fallback
          };
          
  
          if (practitionerResponse.ok) {
            const practitionerData = await practitionerResponse.json();
            if (practitionerData.status === "success" && practitionerData.data) {
              practitioner = {
                name: `${practitionerData.data.first_name} ${practitionerData.data.last_name}`,
                profile_picture_url: practitionerData.data.profile_picture_url,
                practitioner_type: practitionerData.data.practitioner_type,
                specialization: practitionerData.data.specialization,
              };
            }
          }
  
          return {
            id: appointment.id,
            appointment_start_time: appointment.appointment_start_time,
            appointment_end_time: appointment.appointment_end_time,
            appointment_reason: appointment.appointment_reason,
            appointment_status: appointment.appointment_status,
            medical_practitioner: practitioner,
            practitioner_type: appointment.practitioner_type
          };
        });
  
        // Wait for all practitioner fetches
        const detailedAppointments = await Promise.all(appointmentPromises);
        setAppointments(detailedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const services: Service[] = [
    { id: "1", name: "Hospitals", icon: "bed-outline", color: "#4CAF50" },
    { id: "2", name: "Drug refill", icon: "flask-outline", color: "#2196F3" },
    { id: "3", name: "Emergency", icon: "car-sport-outline", color: "#FF5722" },
    { id: "4", name: "Consultation", icon: "chatbubble-ellipses-outline", color: "#9C27B0" },
  ];

  return (
    <Animated.ScrollView style={[styles.container, pageStyle]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.nameText}>{patientName || "Loading..."}</Text>
        </View>
        <Image
          source={
            patientAvatar
              ? { uri: patientAvatar }
              : require("../../assets/dp.png")
          }
          style={styles.profileImage}
        />
      </View>
  
     {/* Free Consultation Card */}
     <View style={styles.consultationCard}>
        <Text style={styles.consultationText}>
          Get the best consultation from health professionals
        </Text>
        <TouchableOpacity style={styles.consultButton} onPress={() => router.push('./services')}>
      <Text style={styles.consultButtonText}>Find a doctor</Text>
    </TouchableOpacity>
      </View>

      

      <Text style={styles.sectionTitle}>Our Services</Text>
      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <Animated.View
            key={service.id}
            style={[
              styles.serviceBox,
              { backgroundColor: service.color },
              serviceStyles[index],
            ]}
          >
            <TouchableOpacity onPress={() => router.push("./services")}>
              <Ionicons name={service.icon} size={40} color="white" />
              <Text style={styles.serviceText}>{service.name}</Text>
            </TouchableOpacity>

            
          </Animated.View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Appointments</Text>
{appointments.length > 0 ? (
  appointments.map((appointment) => (
    <TouchableOpacity
      key={appointment.id}
      style={styles.appointmentCard}
      onPress={() => router.push(`./appointmentInfo`)} // Navigate to a detailed appointment page
    >

<View style={styles.doctorInfo}>
        <Image
          source={{
            uri: appointment.medical_practitioner.profile_picture_url,
          }}
          style={styles.doctorImage}
        />
        <Text style={styles.doctorName}>
        {appointment.medical_practitioner.name} | {" "}
        
        </Text>
        <Text style={styles.doctorName2}>
        {appointment.medical_practitioner.specialization || "N/A"} 
        
        </Text>
      </View>
      <Text style={styles.appointmentTime}>
        {new Date(appointment.appointment_start_time).toLocaleTimeString()} -{" "}
        {new Date(appointment.appointment_end_time).toLocaleTimeString()}
      </Text>
      <Text style={styles.appointmentDate}>
        {new Date(appointment.appointment_start_time).toDateString()}
      </Text>
      <Text style={styles.appointmentReason}>
        Reason: {appointment.appointment_reason || "Not specified"}
      </Text>
      <Text style={styles.appointmentStatus}>
        Status: {appointment.appointment_status}
      </Text>
      
    </TouchableOpacity>
  ))
) : (
  <Text style={styles.noAppointmentsText}>No appointments scheduled.</Text>
)}

    </Animated.ScrollView>
  );
}
