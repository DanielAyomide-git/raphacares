import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../api/config'; // Adjust the path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define TypeScript interfaces for the API response
interface Availability {
  [key: string]: string; // e.g., { "monday": "9am-5pm", "tuesday": "9am-5pm" }
}

interface User {
  user_type: string;
  email: string;
  email_verified: boolean;
  disabled: boolean;
}

interface MedicalPractitioner {
  first_name: string;
  last_name: string;
  other_names: string;
  profile_picture_url: string | null;
  practitioner_type: string;
  specialization: string;
  availability: Availability;
  phone_number: string;
  license_number: string;
  is_verified: boolean;
  is_available: boolean;
  user: User;
}

// Main Component
const HealthWorkerInfo: React.FC = () => {
  const router = useRouter();
  const [storedId, setId] = useState<string | null>(null); // Store the ID from AsyncStorage
  const [healthWorker, setHealthWorker] = useState<MedicalPractitioner | null>(null); // Store fetched data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch ID from AsyncStorage and data from API
  useEffect(() => {
    const fetchHealthWorkerInfo = async () => {
      try {
        const storedId = await AsyncStorage.getItem('selectedPractitionerId'); // Retrieve ID
        if (storedId) {
          setId(storedId);

          // Fetch data from the API
          const endpoint = `${API_BASE_URL}/medical_practitioners/${storedId}`;
          
                const response = await fetch(endpoint);
          const { data }: { data: MedicalPractitioner } = await response.json(); // Extract the data object
          setHealthWorker(data);
        }
      } catch (error) {
        console.error('Error fetching health worker data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthWorkerInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!healthWorker) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Failed to load health worker information.</Text>
      </View>
    );
  }

  const {
    first_name,
    last_name,
    profile_picture_url,
    practitioner_type,
    specialization,
    availability,
  } = healthWorker;

  const handleBookAppointment = async () => {
    try {
      // Save the medical practitioner ID to AsyncStorage
      if (storedId) {
        await AsyncStorage.setItem('medical_practitioner_id', storedId);
      }

      // Navigate to the book appointment screen
      router.push('./bookAppointment');
    } catch (error) {
      console.error('Error saving medical practitioner ID:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('./services')}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {/* Profile Picture */}
        {profile_picture_url ? (
          <Image source={{ uri: profile_picture_url }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileCircle}>
            <Ionicons name="person-outline" size={50} color="gray" />
          </View>
        )}
        <Text style={styles.name}>{`${first_name} ${last_name}`}</Text>
        <Text style={styles.role}>
          {practitioner_type ? practitioner_type.charAt(0).toUpperCase() + practitioner_type.slice(1) : "N/A"}
        </Text>
        <Text style={styles.specialization}>
          Specialization: {specialization || "N/A"}
        </Text>
      </View>
      
      <View style={styles.availabilityContainer2}>
        <Text style={styles.availabilityTitle}>Availability</Text>
        <Text style={styles.availabilityTitle}>Time</Text>
      </View>

      {/* Availability Section */}
      <View style={styles.availabilityContainer}>
        {Object.keys(availability || {}).length > 0 ? (
          Object.entries(availability)
            .filter(([day, time]) => time) // Filter out days with null or empty times
            .map(([day, time]) => (
              <View key={day} style={styles.availabilityRow}>
                {/* Day on the left */}
                <Text style={styles.day}>{day.charAt(0).toUpperCase() + day.slice(1)}:</Text>
                {/* Time on the right */}
                <Text style={styles.time}>{time}</Text>
              </View>
            ))
        ) : (
          <Text style={styles.noAvailability}>Not Available</Text>
        )}
      </View>

      {/* Book Appointment Button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookAppointment} // Save ID and navigate
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  role: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  specialization: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  availabilityContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingTop: 10,
  },
  availabilityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  availabilityContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: 'transparent',
    paddingTop: 10,
  },
  day: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    flex: 1, // Allows the text to adjust based on available space
  },
  time: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'right', // Aligns the time to the right
    flex: 1, // Ensures consistent spacing with the day
  },
  noAvailability: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  bookButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HealthWorkerInfo;
