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
  appointment_reason: string;
  appointment_note: string;
  appointment_status: string;
  appointment_end_time: string;
  appointment_created: string;
  appointment_type: string;
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
  const [dob, setDob] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [patientAvatar, setPatientAvatar] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFullAppointments, setShowFullAppointments] = useState<boolean>(false); // State to toggle full list of appointments

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

      // Decode the token to get the `id`
      const decodedToken = jwtDecode(token) as { id: string; profile_id: string };
      const patientId = decodedToken.profile_id;

      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
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
        setDob(data.data.date_of_birth || "N/A");
        setGender(data.data.gender || "N/A");

        // Save patient data to AsyncStorage
        await AsyncStorage.setItem("patient_name", fullName);
        await AsyncStorage.setItem("date_of_birth", data.data.date_of_birth || "N/A");
        await AsyncStorage.setItem("gender", data.data.gender || "N/A");

        // Fetch appointments for the patient
        fetchAppointments(patientId, token);
      } else {
        throw new Error("Patient data not found");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Updated `fetchAppointments` function:
  const fetchAppointments = async (patientId: string, token: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/?patient_id=${patientId}`,
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
        const appointmentPromises = data.data
          .filter((appointment: any) => appointment.patient_id === patientId) // Filter appointments by patient_id
          .map(async (appointment: any) => {
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
              specialization: "",
            };

            if (practitionerResponse.ok) {
              const practitionerData = await practitionerResponse.json();
              if (practitionerData.status === "success" && practitionerData.data) {
                practitioner = {
                  name: `${practitionerData.data.first_name} ${practitionerData.data.last_name}`,
                  profile_picture_url: practitionerData.data.profile_picture_url,
                  practitioner_type: practitionerData.data.practitioner_type,
                  specialization: practitionerData.data.specialization || "N/A",
                };
              }
            }

            return {
              id: appointment.id,
              appointment_start_time: appointment.appointment_start_time,
              appointment_end_time: appointment.appointment_end_time,
              appointment_reason: appointment.appointment_reason,
              appointment_status: appointment.appointment_status,
              appointment_note: appointment.appointment_note,
              medical_practitioner: practitioner,
              appointment_created: appointment.created_at
            };
          });

        const detailedAppointments = await Promise.all(appointmentPromises);

        // Sort appointments by start time (newest first)
        detailedAppointments.sort(
          (a, b) =>
            new Date(b.appointment_created).getTime() - new Date(a.appointment_created).getTime()
        );
        

        setAppointments(detailedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const handleShowMore = () => {
    setShowFullAppointments(!showFullAppointments);
  };
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
        <ActivityIndicator size="large" color="#00CDF9" />
      </View>
    );
  }

  const services: Service[] = [
    { id: "1", name: "Hospitals", icon: "bed-outline", color: "#FFB815" },
    { id: "2", name: "Drug refill", icon: "flask-outline", color: "#00CDF9" },
    { id: "3", name: "Consultation", icon: "chatbubble-ellipses-outline", color: "#00CDF9" },
    { id: "4", name: "Emergency", icon: "car-sport-outline", color: "#ff7e57" },
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
      <Text style={styles.consultButtonText}>Book an appointment</Text>
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
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          if (service.name === "Consultation") {
            router.navigate("./Consultations");
          } else {
            router.push("./services"); 
          }
        }}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Ionicons name={service.icon} size={40} color="white" />
        <Text style={styles.serviceText}>{service.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  ))}
</View>



      <Text style={styles.sectionTitle}>Appointments</Text>
      {appointments.length > 0 ? (
  <>
    {appointments
      .slice(0, showFullAppointments ? appointments.length : 3) // Show limited or full appointments
      .map((appointment) => (
        <TouchableOpacity
        key={appointment.id}
        style={styles.appointmentCard}
        onPress={async () => {
          try {
            // Save patient details
            await AsyncStorage.setItem("patient_name", patientName);
            await AsyncStorage.setItem("date_of_birth", dob);
            await AsyncStorage.setItem("gender", gender);
      
            // Save appointment and practitioner details
            await AsyncStorage.setItem(
              "practitioner_type",
              appointment.medical_practitioner.practitioner_type
            );
            await AsyncStorage.setItem(
              "specialization",
              appointment.medical_practitioner.specialization
            );
            await AsyncStorage.setItem(
              "practitioner_name",
              appointment.medical_practitioner.name
            );
            await AsyncStorage.setItem(
              "practitioner_profile_picture_url",
              appointment.medical_practitioner.profile_picture_url ||""
            );
            await AsyncStorage.setItem(
              "appointment_start_time",
              appointment.appointment_start_time
            );
            await AsyncStorage.setItem(
              "appointment_end_time",
              appointment.appointment_end_time
            );
            await AsyncStorage.setItem(
              "appointment_reason",
              appointment.appointment_reason
            );
            await AsyncStorage.setItem(
              "appointment_note",
              appointment.appointment_note || "No notes provided"
            );
            await AsyncStorage.setItem(
              "appointment_status",
              appointment.appointment_status
            );
            await AsyncStorage.setItem("appointment_id", appointment.id);
      
            // Debug: Log all stored items
            const allKeys = await AsyncStorage.getAllKeys();
            const allItems = await AsyncStorage.multiGet(allKeys);
            console.log("AsyncStorage content:");
            allItems.forEach(([key, value]) => {
              console.log(`${key}: ${value}`);
            });
      
            // Navigate to the detailed appointment info page
            router.push("./appointmentInfo");
          } catch (error) {
            console.error("Error saving appointment details:", error);
          }
        }}
      >
        <View style={styles.doctorInfo}>
          <Image
            source={{ uri: appointment.medical_practitioner.profile_picture_url || "https://img.icons8.com/?size=100&id=11730&format=png&color=000000"}}
            style={styles.doctorImage}
          />
          <Text style={styles.doctorName}>
            {appointment.medical_practitioner.name} |{" "}
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
      
      ))}
    {appointments.length > 3 && (
      <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
        <Text style={styles.showMoreText}>
          {showFullAppointments ? "Show Less" : "Show More"}
        </Text>
      </TouchableOpacity>
    )}
  </>
) : (
  <Text style={styles.noAppointmentsText}>No appointments scheduled.</Text>
)}

    </Animated.ScrollView>
  );
}
