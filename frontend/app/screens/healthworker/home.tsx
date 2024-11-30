import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, Image, Animated, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { API_BASE_URL } from "../../api/config";
import { styles } from "../../styles/healthworker/home";

// Define the type for the decoded JWT
interface DecodedToken {
  profile_id: string;
  user_type: string;
  user_id: string;
  id: string;
}

// Define the type for profile data fetched from the API
interface Data {
  first_name: string;
  practitioner_type: string;
}

export default function Dashboard(): JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true); // State to control Welcome message visibility
  const [userType, setUserType] = useState<string>("");
  const [firstName, setFirstName] = useState<string>(""); // State to store user's first name
  const [initial, setInitial] = useState<string>(""); // State to store user's first name
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // For handling errors

  // Create animated values for sliding effects
  const slideAnim = useRef(new Animated.Value(500)).current; // Start from off-screen
  const welcomeSlideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    // Load fonts
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Semibold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
    animateComponents();
    fetchProfileData();
  }, []);

  const animateComponents = () => {
    // Trigger slide-in animation for welcome message
    Animated.timing(welcomeSlideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Trigger slide-in animation for the dashboard
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true,
    }).start();

    // Hide the welcome message after 3 seconds
    setTimeout(() => setShowWelcome(false), 3000);
  };

  const fetchProfileData = async () => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Access token not found. Please log in again.");

      // Decode the token to get user info
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const { profile_id, user_type } = decodedToken;

      if (!profile_id ) {
        throw new Error("Invalid token. Profile ID is missing.");
            }

      // Save user type to state
      setUserType(user_type);

      // Build the API endpoint
      const endpoint = `${API_BASE_URL}/medical_practitioners/${profile_id}`;

      // Fetch user profile
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile. Status: ${response.status}`);
      }

      const data: { status: string; data: Data } = await response.json();

      if (data.status === "success" && data.data) {
        setFirstName(data.data.first_name);
        setInitial(data.data.practitioner_type);
      } else {
        throw new Error("Failed to fetch profile data.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFB815" />
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
    <View style={styles.container}>
      {/* Show "Welcome to Raphacares" for 3 seconds */}
      {showWelcome ? (
        <Animated.View
          style={[
            styles.welcomeContainer,
            { transform: [{ translateX: welcomeSlideAnim }] },
          ]}
        >
          <Text style={styles.welcomeText1}>Welcome to Raphacares</Text>
        </Animated.View>
      ) : (
        // Main Dashboard
        <Animated.View
          style={[
            styles.dashboardContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: "https://bit.ly/dan-abramov" }}
              style={styles.avatar}
              accessible={true}
              accessibilityLabel={`${userType}'s avatar`}
            />
            <View>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.doctorText}>
              {initial.charAt(17).toUpperCase() + initial.slice(18)} {firstName.charAt(0).toUpperCase() + firstName.slice(1)}

                 
              </Text>
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
      )}
    </View>
  );
}
