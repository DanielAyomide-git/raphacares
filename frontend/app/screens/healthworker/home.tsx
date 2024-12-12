import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, Image, Animated, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
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
  profile_picture_url: string;

}

export default function Dashboard(): JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [initial, setInitial] = useState<string>("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(""); // New state for profile picture URL
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

      if (!profile_id) {
        throw new Error("Invalid token. Profile ID is missing.");
      }

      setUserType(user_type);

      const endpoint = `${API_BASE_URL}/medical_practitioners/${profile_id}`;

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
        setProfilePictureUrl(data.data.profile_picture_url); // Save the profile picture URL
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
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.dashboardContainer}>
        {/* Header */}
        <View style={styles.header}>
        <Image
            source={
              profilePictureUrl
                ? { uri: profilePictureUrl }
                : require("../../assets/dp.png") // Fallback to local asset
            }
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
      </View>
    </Animated.View>
  );
}