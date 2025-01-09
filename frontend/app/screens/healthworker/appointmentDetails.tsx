import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Details: React.FC = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0); // State to manage star rating
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null); // Store appointment details
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch details from AsyncStorage
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const details = await AsyncStorage.getItem("appointmentDetails");
        if (details) {
          setAppointmentDetails(JSON.parse(details)); // Parse and save details
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, []);

  const handleStarPress = (index: number) => {
    setRating(index + 1); // Update rating when a star is clicked
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00CDF9" />
      </View>
    );
  }

  if (!appointmentDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load appointment details.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>{'<'} Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return ""; // Handle empty or undefined strings
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{'←'}</Text>
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Appointment Details</Text> */}
        <View style={{ width: 20 }} />
      </View>

     

      <Image
        source={{
          uri: appointmentDetails.imageUrl || "https://img.icons8.com/?size=100&id=11730&format=png&color=000000",
        }}
        style={styles.reviewImage}
      />

      <View style={styles.practitionerInfo}>
      <Text style={styles.practitionerName}>
  {capitalizeFirstLetter(appointmentDetails.patientName)}
</Text>
{/* <Text style={styles.speciality}>
  {capitalizeFirstLetter(appointmentDetails.speciality)}
</Text>

<Text style={styles.description}>
  {appointmentDetails.appointmentNote || "No additional notes available."}
</Text> */}

      <Text style={styles.appointmentDate}>
  Date:{" "}
  {new Date(appointmentDetails.appointmentStartTime).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }) || "N/A"}
</Text>
<Text style={styles.appointmentDate}>
  Start Time:{" "}
  {new Date(appointmentDetails.appointmentStartTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }) || "N/A"}
</Text>
<Text style={styles.appointmentDate}>
  End Time:{" "}
  {new Date(appointmentDetails.appointmentEndTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }) || "N/A"}
</Text>

      </View>


  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,

  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
  },
  backButtonContainer: {
    padding: 10,
    backgroundColor: "#00CDF9",
    borderRadius: 8,
  },
  appointmentDate: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'regular',
    marginBottom:10
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:50,
    marginTop:40

  },
  backButton: {
    fontSize: 18,
    color: "#00cdf9",
    fontWeight: "bold",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#00CDF9",
    marginTop:90

  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  reviewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
  },
  practitionerInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  practitionerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00CDF9",
    marginBottom:30
  },
  speciality: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 30,
    marginHorizontal: 4,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    textAlignVertical: "top",
    height: 120,
  },
  addReviewButton: {
    backgroundColor: "#00CDF9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addReviewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Details;
