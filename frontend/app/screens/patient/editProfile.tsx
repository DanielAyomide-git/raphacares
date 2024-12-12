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
import {jwtDecode} from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker

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
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

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
          address: data.data.address || "",
          city: data.data.city || "",
          state: data.data.state || "",
          country: data.data.country || "",
          emergency_contact: data.data.emergency_contact || "",
        });
      }
    } catch (err: any) {
      setError(err.message);
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
      setLoadingSave(false);
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        setError("Access token not found.");
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
  
      const responseData = await response.json(); // Always check response data
      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => router.push("./bio"), 1000);
      } else {
        // Log error details for debugging
        console.error("API error response:", responseData);
        setError(responseData.message || "Failed to update profile.");
      }
    } catch (err: any) {
      // Log the error details
      console.error("Error while updating profile:", err);
      setError(err.message);
    } finally {
      setLoadingSave(false);
    }
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
          <Ionicons name="arrow-back" size={24} color="black" />
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
          placeholderTextColor="#D3D3D3"
          value={formData.last_name}
          onChangeText={(value) => handleInputChange("last_name", value)}
          keyboardType="default"
        />

        <Text style={styles.label}>Other Names</Text>
        <TextInput
          style={styles.input}
          placeholder="Other Names"
          placeholderTextColor="#D3D3D3"
          value={formData.other_names || ""}
          onChangeText={(value) => handleInputChange("other_names", value)}
          keyboardType="default"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#D3D3D3"
          value={formData.phone_number}
          onChangeText={(value) => handleInputChange("phone_number", value)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#D3D3D3"
          value={formData.address || ""}
          onChangeText={(value) => handleInputChange("address", value)}
          keyboardType="default"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="City"
          placeholderTextColor="#D3D3D3"
          value={formData.city || ""}
          onChangeText={(value) => handleInputChange("city", value)}
          keyboardType="default"
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor="#D3D3D3"
          value={formData.state || ""}
          onChangeText={(value) => handleInputChange("state", value)}
          keyboardType="default"
        />

        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#D3D3D3"
          value={formData.country || ""}
          onChangeText={(value) => handleInputChange("country", value)}
          keyboardType="default"
        />

        <Text style={styles.label}>Emergency Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact"
          placeholderTextColor="#D3D3D3"
          value={formData.emergency_contact || ""}
          onChangeText={(value) => handleInputChange("emergency_contact", value)}
          keyboardType="phone-pad"
        />
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
