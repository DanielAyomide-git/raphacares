import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

// Type definition for a Doctor
interface Doctor {
  id: string;
  name: string;
  location: string;
  rating: number;
}

const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Doctors");
  const navigation = useNavigation(); // Access the navigation prop

  // Categories for the tabs
  const categories: string[] = [
    "Doctors",
    "Pharmacy",
    "Ambulance",
    "Hospitals",
  ];

  // Sample doctor data
  const doctors: Doctor[] = [
    { id: "1", name: "Malcolm Function", location: "Taos, NM", rating: 5.0 },
    { id: "2", name: "Ingredia Nutrisha", location: "Dallas, TX", rating: 4.5 },
    { id: "3", name: "Nathaneal Down", location: "Espanola, NM", rating: 4.0 },
    { id: "4", name: "Ursula Gurnmeister", location: "Ellis, Kansas", rating: 5.0 },
    { id: "5", name: "Brandon Guidelines", location: "Kenton, Ohio", rating: 3.5 },
  ];

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      key={item}
      style={[
        styles.tab,
        selectedCategory === item && styles.activeTab,
      ]}
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
        <View style={styles.avatar} />
        <View>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorLocation}>
            <Ionicons name="location-outline" size={14} color="#888" />{" "}
            {item.location}
          </Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#F5C518" />
        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Go back to the previous screen
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  categoryList: {
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginRight: 10, // Space between tabs
  },
  activeTab: {
    borderBottomColor: "#4A90E2",
  },
  tabText: {
    fontSize: 14,
    color: "#888",
  },
  activeTabText: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  doctorList: {
    marginTop: 5,
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
