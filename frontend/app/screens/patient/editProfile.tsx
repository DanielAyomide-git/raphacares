import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

interface DecodedToken {
  profile_id: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  other_names: string | null;
  phone_number: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  emergency_contact: string | null;
  date_of_birth: string | null;
  user_name: string | null;
}

const EditProfile = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingSave, setLoadingSave] = useState<boolean>(false); // Loader state for save
  const [slideAnimation] = useState(new Animated.Value(400)); // Initial position off-screen to the right
  const navigation = useNavigation();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    other_names: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    country: "",
    emergency_contact: "",
    date_of_birth: "",
    user_name: "",
  });

  useEffect(() => {
    fetchProfileData();
    // Start the animation after 3 seconds
    setTimeout(() => {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 300); // 3 seconds delay
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Access token not found. Please log in again.");

      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const { profile_id } = decodedToken;
      if (!profile_id) throw new Error("Invalid token. Profile ID is missing.");

      setProfileId(profile_id);

      const endpoint = `${API_BASE_URL}/patients/${profile_id}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile data. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success" && data.data) {
        setFormData({
          first_name: data.data.first_name || "",
          last_name: data.data.last_name || "",
          other_names: data.data.other_names || "",
          phone_number: data.data.phone_number || "",
          address: data.data.address || "",
          city: data.data.city || "",
          state: data.data.state || "",
          country: data.data.country || "",
          emergency_contact: data.data.emergency_contact || "",
          date_of_birth: data.data.date_of_birth || "",
          user_name: data.data.user_name || "",
        });
      } else {
        throw new Error("Failed to fetch profile data.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoadingSave(true); // Show loader
    if (!profileId) {
      setError("Profile ID is missing.");
      setLoadingSave(false); // Hide loader
      return;
    }

    const endpoint = `${API_BASE_URL}/patients/${profileId}`;
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Access token not found.");

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => router.push("./app"), 1000); // Redirect after 2 seconds     
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the profile.");
    } finally {
      setLoadingSave(false); // Hide loader
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="yellow" />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnimation }] }]}>
      <ScrollView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        {/* Form Inputs */}
        <TextInput
          style={styles.input}
          placeholder="First Name"
          keyboardType="email-address"
          placeholderTextColor="#D3D3D3"
          value={formData.first_name}
          onChangeText={(value) => handleInputChange("first_name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          keyboardType="email-address"
          placeholderTextColor="#D3D3D3"
          value={formData.last_name}
          onChangeText={(value) => handleInputChange("last_name", value)}
        />
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Other Names"
          placeholderTextColor="#D3D3D3"
          value={formData.other_names || ""}
          onChangeText={(value) => handleInputChange("other_names", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Phone Number"
          keyboardType="email-address"
          placeholderTextColor="#D3D3D3"
          value={formData.phone_number}
          onChangeText={(value) => handleInputChange("phone_number", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your home Address"
          keyboardType="email-address"
          placeholderTextColor="#D3D3D3"
          value={formData.address || ""}
          onChangeText={(value) => handleInputChange("address", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter the City you live"
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
          value={formData.city || ""}
          onChangeText={(value) => handleInputChange("city", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your State"
          keyboardType="email-address"
          placeholderTextColor="#D3D3D3"
          value={formData.state || ""}
          onChangeText={(value) => handleInputChange("state", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Country"
          keyboardType="email-address"          
          placeholderTextColor="#D3D3D3"
          value={formData.country || ""}
          onChangeText={(value) => handleInputChange("country", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Emergency Contact"
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
                    value={formData.emergency_contact || ""}
          onChangeText={(value) => handleInputChange("emergency_contact", value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Enter Date of Birth"
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
          value={formData.date_of_birth || ""}
          onChangeText={(value) => handleInputChange("date_of_birth", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter User Name"
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
          value={formData.user_name || ""}
          onChangeText={(value) => handleInputChange("user_name", value)}
        />

        {/* Success/Error Messages */}
        {successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loadingSave}>
          {loadingSave ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  successText: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default EditProfile;
