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
  Modal 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../api/config";
import { useRouter } from 'expo-router'; // Import the router hook
import { useNavigation } from "@react-navigation/native";

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

interface HealthCenter {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  id: string;
}

const EditProfile = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false); // New state for button loader
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [slideAnimation] = useState(new Animated.Value(400));
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [buttonMessage, setButtonMessage] = useState<string | null>(null);

    const router = useRouter();
  
  
  const [newHealthCenterData, setNewHealthCenterData] = useState<HealthCenter>({
    name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    id: "",
  });

  const navigation = useNavigation();

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
    is_available: false,
  });

  const [healthCenterData, setHealthCenterData] = useState<HealthCenter>({
    name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    id: "",
  });

  useEffect(() => {
    fetchProfileData();
    fetchHealthCenters();
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
        const healthCenters = data.data.health_centers;
        const parsedHealthCenters = healthCenters.map((healthCenter: any) => ({
          name: healthCenter.name,
          address: healthCenter.address,
          city: healthCenter.city,
          state: healthCenter.state,
          postal_code: healthCenter.postal_code,
          id: healthCenter.id,
        }));
  
        setHealthCenters(parsedHealthCenters);
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
          is_available: data.data.is_available !== undefined ? data.data.is_available : false,
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

  const fetchHealthCenters = async () => {
    try {
      const storedHealthCenters = await AsyncStorage.getItem("health_centers");
      if (storedHealthCenters) {
        const parsedHealthCenters = JSON.parse(storedHealthCenters);
        if (Array.isArray(parsedHealthCenters)) {
          setHealthCenters(parsedHealthCenters);
        } else {
          setHealthCenters([]); // Set it as an empty array if the data is invalid
          setError("Stored health center data is not valid.");
        }
      } else {
        setHealthCenters([]); // Ensure it's set as an empty array if no data is found
      }
    } catch (err: any) {
      setHealthCenters([]); // Set it as an empty array on error
      setError("Failed to load health centers.");
    } finally {
      setLoading(false);
    }
  };
  const handleActionResponse = (message: string, isSuccess: boolean) => {
    if (isSuccess) {
      setSuccessMessage(message);
    } else {
      setError(message);
    }

    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
      router.push("./app");
    }, 2000);
  };

  const handleHealthCenterInputChange = (field: string, value: string) => {
    setHealthCenterData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleUpdateHealthCenter = async () => {
    if (!profileId) {
      setError("Profile ID is missing.");
      return;
    }

    const { name, address, city, state, postal_code, id } = healthCenterData;

    if (!name || !address || !city || !state || !postal_code) {
      setError("All health center fields are required.");
      return;
    }

    setButtonLoading(true); // Start button loader

    const endpoint = `https://territorial-amaleta-cloobtech-7c903207.koyeb.app/api/v1/health_centers/${id}`;

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Access token not found.");

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          address,
          city,
          state,
          postal_code,
        }),
      });

      if (response.ok) {
        handleActionResponse("Health Center updated successfully!", true);
        fetchHealthCenters();
        setHealthCenterData({
          name: "",
          address: "",
          city: "",
          state: "",
          postal_code: "",
          id: "",
        });
      } else {
        const errorData = await response.json();
        handleActionResponse(errorData.message || "Failed to update health center.", false);
      }
    } catch (err: any) {
      handleActionResponse(err.message || "An error occurred while updating the health center.", false);
    } finally {
      setButtonLoading(false); // Stop button loader
    }
  };


  const handleDeleteHealthCenter = async (id: string) => {
    setButtonLoading(true); // Start loading
    setError(null);
    setSuccessMessage(null);
  
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Access token not found.");
  
      const endpoint = `https://territorial-amaleta-cloobtech-7c903207.koyeb.app/api/v1/health_centers/${id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setSuccessMessage("Health Center deleted successfully!");
        await fetchHealthCenters();
        setTimeout(() => {
          router.push("./app"); // Redirect to '/app' after 2 seconds
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete health center.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting the health center.");
    } finally {
      setButtonLoading(false); // Stop loading
    }
  };
  


  const handleAddHealthCenter = async () => {
    setButtonLoading(true); // Start loading
    setError(null);
    setSuccessMessage(null);
  
    const { name, address, city, state, postal_code } = newHealthCenterData;
  
    if (!name || !address || !city || !state || !postal_code) {
      setError("All health center fields are required.");
      setButtonLoading(false); // Stop loading
      return;
    }
  
    const payload = [
      {
        name,
        address,
        city,
        state,
        postal_code,
        medical_practitioner_id: profileId,
      },
    ];
  
    const endpoint = `https://territorial-amaleta-cloobtech-7c903207.koyeb.app/api/v1/medical_practitioners/${profileId}/add_health_centers`;
  
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Access token not found.");
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        setSuccessMessage("Health Center added successfully!");
        await fetchHealthCenters();
        setModalVisible(false);
        setNewHealthCenterData({
          name: "",
          address: "",
          city: "",
          state: "",
          postal_code: "",
          id: "",
        });
        setTimeout(() => {
          router.push("./app"); // Redirect to '/app' after 2 seconds
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add health center.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the health center.");
    } finally {
      setButtonLoading(false); // Stop loading
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFB815" />
        </TouchableOpacity>

        <Text style={styles.title}>Health Centers</Text>
        {Array.isArray(healthCenters) && healthCenters.length > 0 ? (
  <ScrollView>
    {healthCenters.map((center, index) => (
      <View key={index} style={styles.healthCenterItem}>
        <Text style={styles.healthCenterText}>Name: {center.name}</Text>
        <Text style={styles.healthCenterText}>Address: {center.address}</Text>
        <Text style={styles.healthCenterText}>City: {center.city}</Text>
        <Text style={styles.healthCenterText}>State: {center.state}</Text>
        <Text style={styles.healthCenterText}>Postal Code: {center.postal_code}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setHealthCenterData(center)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
  style={[styles.submitButton, buttonLoading && { backgroundColor: "#ddd" }]} 
  onPress={() => handleDeleteHealthCenter(center.id)} 
  disabled={buttonLoading}
>
  {buttonLoading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.submitButtonText}>Delete</Text>
  )}
</TouchableOpacity>
        </View>
      </View>
    ))}
  </ScrollView>
) : (
  <Text style={styles.noHealthCentersText}>No health centers available.</Text>
)}


        {healthCenterData.id && (
          <>
            <Text style={styles.sectionTitle}>Edit Health Center</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={healthCenterData.name}
              onChangeText={(value) => handleHealthCenterInputChange("name", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={healthCenterData.address}
              onChangeText={(value) => handleHealthCenterInputChange("address", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={healthCenterData.city}
              onChangeText={(value) => handleHealthCenterInputChange("city", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={healthCenterData.state}
              onChangeText={(value) => handleHealthCenterInputChange("state", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Postal Code"
              value={healthCenterData.postal_code}
              onChangeText={(value) => handleHealthCenterInputChange("postal_code", value)}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleUpdateHealthCenter} disabled={buttonLoading}>
      {buttonLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.submitButtonText}>Update Health Center</Text>
      )}
    </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.submitButtonText}>Add New Health Center</Text>
        </TouchableOpacity>

        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Modal for adding health center */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.sectionTitle}>Add Health Center</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={newHealthCenterData.name}
                onChangeText={(value) => setNewHealthCenterData({ ...newHealthCenterData, name: value })}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={newHealthCenterData.address}
                onChangeText={(value) => setNewHealthCenterData({ ...newHealthCenterData, address: value })}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={newHealthCenterData.city}
                onChangeText={(value) => setNewHealthCenterData({ ...newHealthCenterData, city: value })}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={newHealthCenterData.state}
                onChangeText={(value) => setNewHealthCenterData({ ...newHealthCenterData, state: value })}
              />
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                value={newHealthCenterData.postal_code}
                onChangeText={(value) => setNewHealthCenterData({ ...newHealthCenterData, postal_code: value })}
              />
            <TouchableOpacity 
  style={[styles.submitButton, buttonLoading && { backgroundColor: "#ddd" }]} 
  onPress={handleAddHealthCenter} 
  disabled={buttonLoading}
>
  {buttonLoading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.submitButtonText}>Submit</Text>
  )}
</TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.submitButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  healthCenterItem: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  healthCenterText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFB815",
    padding: 20,
    borderRadius: 8,
    
  },
  deleteButton: {
    backgroundColor: "#FF4D4D",
    padding: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#FFB815",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom:10
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#555",
  },
  noHealthCentersText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
    marginBottom:20
  },
  successText: {
    color: "green",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});

export default EditProfile;
