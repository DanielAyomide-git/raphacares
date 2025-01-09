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

const AddReview: React.FC = () => {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Review</Text>
        <View style={{ width: 20 }} />
      </View>

      <Text style={styles.description}>
        {appointmentDetails.appointmentNote || "No additional notes available."}
      </Text>

      <Image
        source={{
          uri: appointmentDetails.imageUrl || "https://via.placeholder.com/150",
        }}
        style={styles.reviewImage}
      />

<View style={styles.practitionerInfo}>
  <Text style={styles.practitionerName}>
   
    {appointmentDetails.doctorName
      ? appointmentDetails.doctorName.charAt(0).toUpperCase() + appointmentDetails.doctorName.slice(1)
      : ""}
  </Text>
  <Text style={styles.speciality}>
    {appointmentDetails.speciality
      ? appointmentDetails.speciality.charAt(0).toUpperCase() + appointmentDetails.speciality.slice(1)
      : ""}
  </Text>

  {/* Rating */}
  <View style={styles.ratingContainer}>
    {[...Array(5)].map((_, index) => (
      <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
        <Text
          style={[
            styles.star,
            { color: index < rating ? "#FFC107" : "#E0E0E0" },
          ]}
        >
          {index < rating ? "★" : "☆"}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>


      {/* Comment Box */}
      <TextInput
        style={styles.commentBox}
        placeholder="Enter Your Comment Here..."
        multiline
      />

      {/* Add Review Button */}
      <TouchableOpacity style={styles.addReviewButton}>
        <Text style={styles.addReviewButtonText}>Add Review</Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop:20

  },
  backButton: {
    fontSize: 18,
    color: "#00CDF9",
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
    marginBottom: 20,
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
  },
  speciality: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
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

export default AddReview;
