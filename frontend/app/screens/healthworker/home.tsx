import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Animated, // Import Animated API
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";

export default function DoctorDashboard() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Create animated value for sliding
  const slideAnim = useRef(new Animated.Value(500)).current; // Start from off-screen right

  useEffect(() => {
    // Load fonts
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();

    // Trigger slide-in animation
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to original position
      duration: 1000, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [slideAnim]);

  if (!fontsLoaded) {
    return null; // Show a loading screen if fonts aren't loaded yet
  }

  // Sample data for recent comments
  const comments = [
    {
      id: "1",
      name: "Moses Aubrey",
      date: "20/04/24",
    },
    {
      id: "2",
      name: "Keith K. John",
      date: "29/03/24",
    },
  ];

  return (
    <Animated.View // Use Animated.View instead of View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]} // Apply sliding animation
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://bit.ly/dan-abramov" }}
          style={styles.avatar}
          accessible={true}
          accessibilityLabel="Doctor's avatar"
        />
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.doctorText}>Dr. Jameson</Text>
        </View>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="black"
          style={styles.settingsIcon}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Clients/Appointments"
          placeholderTextColor="#B0B0B0"
        />
        <Ionicons
          name="search"
          size={20}
          color="#B0B0B0"
          style={styles.searchIcon}
        />
      </View>

      {/* Appointments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paid Appointments</Text>
        <View style={styles.appointmentBox}></View>
      </View>

      {/* Recent Comments Section */}
      <View style={styles.section}>
        <View style={styles.commentsHeader}>
          <Text style={styles.sectionTitle}>Most Recent Appointments</Text>
        </View>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <View style={styles.commentAvatar}></View>
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentName}>{item.name}</Text>
                <Text style={styles.commentDate}>{item.date}</Text>
              </View>
            </View>
          )}
        />
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: "Poppins",
    fontSize: 20,
    color: "black",
    marginLeft: 10,
  },
  doctorText: {
    fontFamily: "Poppins-Bold",
    color: "#0041F9",
    marginLeft: 10,
  },
  settingsIcon: {
    marginLeft: "auto",
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
    fontFamily: "Poppins-Bold",
    color: "#0041F9",
    fontSize: 16,
    marginBottom: 10,
  },
  appointmentBox: {
    height: 100,
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readMoreText: {
    fontFamily: "Poppins",
    color: "#0041F9",
    fontSize: 12,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A0A0A0",
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentName: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  commentText: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "#6B6B6B",
  },
  commentDate: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: "#A0A0A0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
});
