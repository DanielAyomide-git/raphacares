import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker"; // Import Picker

interface DecodedToken {
  profile_id: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  other_names: string | null;
  phone_number: string;
  date_of_birth: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  emergency_contact: string | null;
  gender: string;
}

const EditProfile: React.FC = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [slideAnimation] = useState(new Animated.Value(400));
  const navigation = useNavigation();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    other_names: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
    city: "",
    state: "",
    country: "",
    gender: "",
    emergency_contact: "",
  });

  useEffect(() => {
    fetchProfileData();
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Access token not found. Please log in again.");

      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      setProfileId(decodedToken.profile_id);

      const response = await fetch(`${API_BASE_URL}/patients/${decodedToken.profile_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch profile data.");

      const data = await response.json();
      if (data?.status === "success" && data?.data) {
        setFormData({
          first_name: data.data.first_name || "",
          last_name: data.data.last_name || "",
          other_names: data.data.other_names || "",
          phone_number: data.data.phone_number || "",
          date_of_birth: data.data.date_of_birth.split("T")[0] || "",
          address: data.data.address || "",
          city: data.data.city || "",
          state: data.data.state || "",
          gender: data.data.gender || "",
          country: data.data.country || "",
          emergency_contact: data.data.emergency_contact || "",
        });
      }
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 2000); // Clear error after 2 seconds
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoadingSave(true);
    if (!profileId) {
      setError("Profile ID is missing.");
      setTimeout(() => setError(null), 2000); // Clear error after 2 seconds
      setLoadingSave(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        setError("Access token not found.");
        setTimeout(() => setError(null), 2000); // Clear error after 2 seconds
        setLoadingSave(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/patients/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(null), 2000); // Clear success message after 2 seconds
        setTimeout(() => router.push("./app"), 1000);
      } else {
        setError(responseData.message || "Invalid Date format");
        setTimeout(() => setError(null), 2000); // Clear error after 2 seconds
      }
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 2000); // Clear error after 2 seconds
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDateInput = (value: string) => {
    // Remove any non-numeric characters
    const cleaned = value.replace(/[^0-9]/g, "");

    // Format as YYYY-MM-DD
    let formatted = cleaned;
    if (cleaned.length > 3) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    if (cleaned.length > 5) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    }

    // Restrict to 10 characters (YYYY-MM-DD)
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }

    handleInputChange("date_of_birth", formatted);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00CDF9" />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnimation }] }]}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00cdf9" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#D3D3D3"
            value={formData.first_name}
            onChangeText={(value) => handleInputChange("first_name", value)}
            keyboardType="default"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#ededed"
            value={formData.last_name}
            onChangeText={(value) => handleInputChange("last_name", value)}
            keyboardType="default"
          />

          <Text style={styles.label}>Other Names</Text>
          <TextInput
            style={styles.input}
            placeholder="Other Names"
            placeholderTextColor="#ededed"
            value={formData.other_names || ""}
            onChangeText={(value) => handleInputChange("other_names", value)}
            keyboardType="default"
          />

          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={formData.gender}
            style={styles.input}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>

          <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Date of Birth"
            placeholderTextColor="#D3D3D3"
            value={formData.date_of_birth || ""}
            onChangeText={(value) => handleDateInput(value)}
            keyboardType="phone-pad"
          />

          {/* Other input fields... */}

        </View>

        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loadingSave}>
          {loadingSave ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.submitButtonText}>Save Changes</Text>}
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
  inputContainer: {
    marginBottom: 15, // Space between each field
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginBottom: 20,
    marginTop:30
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#00CDF9',
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14, // Adjust the font size
    color: '#00CDF9', // Adjust text color
    marginBottom: 8, // Space between label and input
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#00CDF9",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom:20,
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
