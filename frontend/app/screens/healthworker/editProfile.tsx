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
  other_names: string;
  phone_number: string;
  specialization: string;
  practitioner_type: string;
  license_number: string;
  email: string;
  availability: { [key: string]: string };
  is_available: boolean;
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
    specialization: "",
    practitioner_type: "",
    license_number: "",
    email: "",
    availability: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    is_available: false, // Default is false
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

      const endpoint = `${API_BASE_URL}/medical_practitioners/${profile_id}`;
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
          specialization: data.data.specialization || "",
          practitioner_type: data.data.practitioner_type || "",
          license_number: data.data.license_number || "",
          email: data.data.user.email || "",
          availability: data.data.availability || formData.availability,
          is_available: data.data.is_available !== undefined ? data.data.is_available : false, // Use the fetched value or default to false
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

  const handleAvailabilityChange = (day: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      availability: {
        ...prevState.availability,
        [day]: value,
      },
    }));
  };

  const handleCheckboxToggle = () => {
    // Toggle is_available based on checkbox state
    setFormData((prevState) => ({
      ...prevState,
      is_available: !prevState.is_available, // If checkbox is checked, is_available will be true; if unchecked, false
    }));
  };

  const handleSubmit = async () => {
    setLoadingSave(true); // Show loader
    if (!profileId) {
      setError("Profile ID is missing.");
      setLoadingSave(false); // Hide loader
      return;
    }

    const endpoint = `${API_BASE_URL}/medical_practitioners/${profileId}`;
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
       setTimeout(() => router.back(), 1000); // Redirect after 2 seconds     
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
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
          value={formData.first_name}
          onChangeText={(value) => handleInputChange("first_name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
          value={formData.last_name}
          onChangeText={(value) => handleInputChange("last_name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Other Names"
          keyboardType="email-address"
          placeholderTextColor="#D3D3D3"
          value={formData.other_names}
          onChangeText={(value) => handleInputChange("other_names", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
          value={formData.phone_number}
          onChangeText={(value) => handleInputChange("phone_number", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Specialization"
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
          value={formData.specialization}
          onChangeText={(value) => handleInputChange("specialization", value)}
        />

        {/* Practitioner Type Dropdown */}
        <Text style={styles.sectionTitle}>Practitioner Type</Text>
        <Picker
          selectedValue={formData.practitioner_type}
          onValueChange={(value) => handleInputChange("practitioner_type", value)}
          style={styles.picker}
        >
          <Picker.Item label="Doctor" value="doctor" />
          <Picker.Item label="Nurse" value="nurse" />
          <Picker.Item label="Pharmacist" value="community_health" />
        </Picker>

        {/* License Number */}
        <TextInput
          style={styles.input}
          placeholder="License Number"
          placeholderTextColor="#D3D3D3"
          keyboardType="email-address"
          value={formData.license_number}
          onChangeText={(value) => handleInputChange("license_number", value)}
        />

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#D3D3D3"
          value={formData.email}
          keyboardType="email-address"
          onChangeText={(value) => handleInputChange("email", value)}
        />

        {/* Availability */}
        <Text style={styles.sectionTitle}>Availability</Text>
        {Object.entries(formData.availability).map(([day, time]) => (
          <View key={day} style={styles.availabilityRow}>
            <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}:</Text>
            <TextInput
              style={styles.availabilityInput}
              placeholder="Example: 12am - 12pm"
              value={time}
              placeholderTextColor="#D3D3D3"
              onChangeText={(value) => handleAvailabilityChange(day, value)}
            />
          </View>
        ))}

        {/* Is Available */}
        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>Available for Appointments:</Text>
          <TouchableOpacity
            style={[
              styles.checkbox,
              formData.is_available ? styles.checkboxChecked : styles.checkboxUnchecked,
            ]}
            onPress={handleCheckboxToggle}
          >
            {formData.is_available && <Ionicons name="checkmark" size={18} color="white" />}
          </TouchableOpacity>
        </View>

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
    backgroundColor: "#FFFFFF", // Background color for the loader screen
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 16,
    flex: 1,
    color: "#555",
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "white",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  checkboxUnchecked: {
    backgroundColor: "white",
    borderColor: "#ccc",
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 8,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  successText: {
    fontSize: 18,
    color: "green",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
    padding: 10,
  },
});

export default EditProfile;
