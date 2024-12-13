import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
  practitioner_type: string;
  specialization: string;
}

const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Doctors");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const router = useRouter();

  const categories: string[] = ["Doctors", "Pharmacy", "Nurse"];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/medical_practitioners/"
        );
        const data = await response.json();
        if (data.status === "success") {
          setDoctors(data.data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorPress = async (doctorId: string) => {
    try {
      // Save doctor id to AsyncStorage
      await AsyncStorage.setItem("selectedDoctorId", doctorId);
      console.log(doctorId)

      // Navigate to healthWorkerInfo page
      router.push("./healthWorkerInfo");
    } catch (error) {
      console.error("Error saving doctor ID:", error);
    }
  };

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      key={item}
      style={[styles.tab, selectedCategory === item && styles.activeTab]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.tabText,
          selectedCategory === item && styles.activeTabText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <View style={styles.doctorInfo}>
        <View style={styles.avatar}>
          {item.profile_picture_url ? (
            <Image
              source={{ uri: item.profile_picture_url }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={50} color="#E0E0E0" />
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => handleDoctorPress(item.id)}>
            <Text style={styles.doctorName}>
              {item.first_name} {item.last_name}
            </Text>
          </TouchableOpacity>
          <Text style={styles.doctorSpecialization}>
          {item.practitioner_type
            ? item.practitioner_type.charAt(0).toUpperCase() + item.practitioner_type.slice(1)
            : "N/A"}
        </Text>

          <Text style={styles.doctorSpecialization}>
            Specialization: {item.specialization || "N/A"}
          </Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#F5C518" />
        <Text style={styles.ratingText}>5.0</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("./app")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Horizontally Scrollable Category Tabs */}
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
        />

        {/* List of Doctors */}
        <FlatList
          data={doctors}
          renderItem={renderDoctor}
          keyExtractor={(item) => item.id}
          style={styles.doctorList}
          scrollEnabled={false} // Disable FlatList scrolling since ScrollView handles it
        />
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryList: {
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8, // Adjust vertical padding for better spacing
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginRight: 10,
  },
  activeTab: {
    borderBottomColor: "#4A90E2",
  },
  tabText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center", // Ensure proper alignment
    marginBottom: 0, // Remove unnecessary negative margin
  },
  activeTabText: {
    color: "#4A90E2",
    fontWeight: "bold",
    textAlign: "center", // Ensure proper alignment
  },
  
  doctorList: {
    marginTop: 10,
  },
  doctorCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  doctorLocation: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
});

export default Services;
