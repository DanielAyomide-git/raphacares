import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function DoctorDashboard() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Show a loading screen if fonts aren't loaded yet
  }

  // Sample data for recent comments
  const comments = [
    {
      id: "1",
      name: "Moses Aubrey",
      text: "Love the experience, great job guys",
      date: "20/04/24",
    },
    {
      id: "2",
      name: "Keith K. John",
      text: "Love the experience, great job guys",
      date: "29/03/24",
    },
  ];

  return (
    <View style={styles.container}>
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
          name="settings-outline"
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
        <Text style={styles.sectionTitle}>APPOINTMENTS</Text>
        <View style={styles.appointmentBox}></View>
      </View>

      {/* Recent Comments Section */}
      <View style={styles.section}>
        <View style={styles.commentsHeader}>
          <Text style={styles.sectionTitle}>Most Recent Comments</Text>
          <TouchableOpacity>
            <Text style={styles.readMoreText}>Read Old Comments</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <View style={styles.commentAvatar}></View>
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentName}>{item.name}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentDate}>{item.date}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/healthworker/home")}>
          <FontAwesome5 name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/healthworker/User")}>
          <FontAwesome5 name="user-alt" size={24} color="#9F9F9F" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/healthworker/Notification")}
        >
          <Ionicons name="notifications-outline" size={24} color="#9F9F9F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/healthworker/Message")}>
          <MaterialIcons name="message" size={24} color="#9F9F9F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/healthworker/Mail")}>
          <MaterialIcons name="mail-outline" size={24} color="#9F9F9F" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: "space-between",
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
});
