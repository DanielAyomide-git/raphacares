import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../api/config";
import { StyleSheet } from "react-native";
import { useRouter } from 'expo-router'; // Import the router hook


// Define types (same as before)
interface DecodedToken {
  profile_id: string;
  user_type: string;
}

interface ProfileData {
  first_name: string;
  last_name: string;
  practitioner_type: string;
  profile_picture_url: string;
}

interface Appointment {
  id: string;
  health_center_id: string;
  appointment_start_time: string;
  appointment_end_time: string;
  appointment_reason: string;
  appointment_status: string;
  appointment_note: string;
  appointment_type: string;
  patient_id: string;
  medical_practitioner_id: string;
  created_at: string;
  patient?: Patient | null;
  health_centers?: Array<object>; // Define health_centers as an optional array


}

interface Patient {
  id: string;
  profile_picture_url: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  state: string;
}

export default function Dashboard(): JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [initial, setInitial] = useState<string>("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [decoded, setDecoded] = useState<DecodedToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleAppointments, setVisibleAppointments] = useState<Appointment[]>([]); // Track visible appointments
  const [showMore, setShowMore] = useState<boolean>(false); // Track show more/less state
  const router = useRouter();
  

  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Semibold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
    fetchProfileData();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Access token not found. Please log in again.");

      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const { profile_id, user_type } = decodedToken;

      if (!profile_id) throw new Error("Invalid token. Profile ID is missing.");

      setUserType(user_type);

      const response = await fetch(`${API_BASE_URL}/medical_practitioners/${profile_id}?get_health_centers=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Failed to fetch profile. Status: ${response.status}`);

      const data: { status: string; data: ProfileData } = await response.json();

      if (data.status === "success" && data.data) {
        setFirstName(data.data.first_name);
        setLastName(data.data.last_name);
        setInitial(data.data.practitioner_type);
        setProfilePictureUrl(data.data.profile_picture_url);
        fetchAppointments(profile_id, token);
      } else throw new Error("Failed to fetch profile data.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAppointments = async (profileId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments?get_health_centers=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Failed to fetch appointments. Status: ${response.status}`);

      const data: { status: string; data: Appointment[] } = await response.json();

      if (data.status === "success" && data.data) {
        const filteredAppointments = data.data
          .filter((appointment) => appointment.medical_practitioner_id === profileId)
          .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB.getTime() - dateA.getTime();
          });

        const enrichedAppointments = await Promise.all(
          filteredAppointments.map(async (appointment) => {
            try {
              const patientResponse = await fetch(
                `${API_BASE_URL}/patients/${appointment.patient_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (patientResponse.ok) {
                const patientData: { status: string; data: Patient } =
                  await patientResponse.json();
                return { ...appointment, patient: patientData.data };
              }
            } catch {
              // Fallback if patient data cannot be fetched
            }
            return { ...appointment, patient: null };
          })
        );

        setAppointments(enrichedAppointments);
        setVisibleAppointments(enrichedAppointments.slice(0, 3)); // Show only 3 appointments initially
      } else throw new Error("Failed to fetch appointments data.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowMore = () => {
    if (showMore) {
      setVisibleAppointments(appointments.slice(0, 3)); // Show only 3 appointments if 'Show More' is clicked
    } else {
      setVisibleAppointments(appointments); // Show all appointments if 'Show Less' is clicked
    }
    setShowMore(!showMore);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="yellow" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.dashboardContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.doctorText}>
                {firstName} {lastName}
              </Text>
            </View>
            <Image
              source={
                profilePictureUrl
                  ? { uri: profilePictureUrl }
                  : require("../../assets/dp.png")
              }
              style={styles.avatar}
              accessible={true}
              accessibilityLabel={`${userType}'s avatar`}
            />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for Clients/Appointments"
              placeholderTextColor="#B0B0B0"
            />
            <Ionicons name="search" size={20} color="#B0B0B0" style={styles.searchIcon} />
          </View>

          {/* Appointments Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Appointments</Text>
            
            {/* Check if there are no appointments */}
            {appointments.length === 0 ? (
              <Text style={styles.noAppointmentsText}>No appointments</Text>
            ) : (
              <FlatList
              data={visibleAppointments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={async () => {
                    if (item) {
                      try {
                        const appointmentData = {
                          patient_first_name: item.patient?.first_name || "",
                          patient_last_name: item.patient?.last_name || "",
                          patient_gender: item.patient?.gender || "",
                          patient_date_of_birth: item.patient?.date_of_birth || "",
                          appointment_reason: item.appointment_reason || "",
                          appointment_status: item.appointment_status || "",
                          patient_id: item.patient_id || "",
                          appointment_type: item.appointment_type || "",
                          appointment_start_time: item.appointment_start_time || "",
                          appointment_end_time: item.appointment_end_time || "",
                          appointment_note: item.appointment_note || "",
                          id: item.id || "",
                          health_center_id: item.health_center_id || "",
                          health_center: item.health_centers || null, // Include health_center
                          medical_practitioner_id: item.medical_practitioner_id || ""
                        };
            
                        // Log the data to the console
                        console.log("appointmentData:", appointmentData);
            
                        // Save the entire item object as `appointmentData` in AsyncStorage
                        await AsyncStorage.setItem("appointmentData", JSON.stringify(appointmentData));
            
                        // Navigate to the details screen
                        router.push("./appointmentInfo");
                      } catch (error) {
                        console.error("Failed to save appointment details to AsyncStorage", error);
                      }
                    }
                  }}
                >
                  <Image
                    source={
                      item.patient?.profile_picture_url
                        ? { uri: item.patient.profile_picture_url }
                        : require("../../assets/dp.png")
                    }
                    style={styles.cardAvatar}
                  />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardName}>
                      {item.patient?.first_name} {item.patient?.last_name}
                    </Text>
                    <Text style={styles.appointmentTime}>
                      {new Date(item.appointment_start_time).toLocaleTimeString()} -{" "}
                      {new Date(item.appointment_end_time).toLocaleTimeString()}
                    </Text>
                    <Text style={styles.appointmentDate}>
                      {new Date(item.appointment_start_time).toDateString()}
                    </Text>
                    <Text style={styles.cardReason}>Reason: {item.appointment_reason}</Text>
                    <Text style={styles.cardStatus}>Status: {item.appointment_status}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            
            )}

            <TouchableOpacity style={styles.showMoreButton} onPress={toggleShowMore}>
              <Text style={styles.showMoreText}>
                {showMore ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  showMoreButton: {
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFB815",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  noAppointmentsText: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#FFB815",
    textAlign: "center",
    marginVertical: 20,
  },
  showMoreText: {
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFEEEE",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  scrollViewContainer: {
    flexGrow: 1, // Ensures the content takes up the full available space
    paddingBottom: 20, // Adds bottom padding to avoid content being cut off at the bottom
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: "Poppins",
    fontSize: 24,
    color: "#FFB815",
    textAlign: "center",
  },
  doctorText: {
    fontFamily: "Poppins-SemiBold",
    color: "#FFB815",
    marginLeft: 2,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: "auto",
    marginBottom: 18,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    color: "#FFB815",
    fontSize: 16,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#FFB815",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    fontFamily: "Poppins",
    fontSize: 14,
    marginBottom: 5,
  },
  cardDetails: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "#666",
  },
  cardStatus: {
      fontSize: 14,
      fontFamily: "Poppins",
      color: "brown",
      marginTop: 5,
    },
  appointmentTime: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFB815",
    marginBottom: 5,
  },
  appointmentDate: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#555",
    marginBottom: 10,
  },
  cardReason: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});
