import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router'; // Import the router hook
import { API_BASE_URL } from "../../api/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

interface Appointment {
  id: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  rating: number;
  imageUrl: string;
  category: 'Complete' | 'Pending' | 'Cancelled';
  appointmentStatus: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
}

const AppointmentsScreen: React.FC = () => {
  const router = useRouter(); // Initialize the router
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<'Complete' | 'Pending' | 'Cancelled'>('Pending');

  // Fetch appointments and practitioner data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch(`${API_BASE_URL}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();

        if (data.status === 'success' && data.data) {
          const appointmentsWithDetails = await Promise.all(data.data.map(async (appointment: any) => {
            // Fetch medical practitioner details
            const practitionerResponse = await fetch(
              `${API_BASE_URL}/medical_practitioners/${appointment.medical_practitioner_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            let practitioner = {
              name: "Unknown Practitioner",
              profile_picture_url: "https://via.placeholder.com/100",
              practitioner_type: "",
              specialization: "",
            };

            if (practitionerResponse.ok) {
              const practitionerData = await practitionerResponse.json();
              if (practitionerData.status === 'success' && practitionerData.data) {
                practitioner = {
                  name: `${practitionerData.data.first_name} ${practitionerData.data.last_name}`,
                  profile_picture_url: practitionerData.data.profile_picture_url,
                  practitioner_type: practitionerData.data.practitioner_type,
                  specialization: practitionerData.data.specialization,
                };
              }
            }

            // Determine category based on appointment status
            const category: 'Complete' | 'Pending' | 'Cancelled' = appointment.appointment_status === 'completed' 
              ? 'Complete' 
              : appointment.appointment_status === 'pending' 
              ? 'Pending' 
              : appointment.appointment_status === 'cancelled' 
              ? 'Cancelled'
              : 'Cancelled'; // Default to 'Cancelled' for any unhandled status

            return {
              id: appointment.id,
              doctorName: practitioner.name,
              speciality: practitioner.specialization,
              imageUrl: practitioner.profile_picture_url,
              rating: 5, // Hardcoded as an example, can be adjusted accordingly
              category: category,
              appointmentStatus: appointment.appointment_status,
              appointmentStartTime: appointment.appointment_start_time,
              appointmentEndTime: appointment.appointment_end_time,
            };
          }));

          setAppointments(appointmentsWithDetails);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.category === selectedCategory
  );

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    return (
      <View style={styles.appointmentCard}>
        <View style={styles.topRow}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.doctorImage}
          />
          <Text style={styles.doctorName}>{item.doctorName}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.speciality}>{item.speciality}</Text>
          {selectedCategory === 'Pending' && (
            <>
              <Text style={styles.date}>
                {new Date(item.appointmentStartTime).toDateString()}
              </Text>
              <Text style={styles.time}>
                {new Date(item.appointmentStartTime).toLocaleTimeString()} -{' '}
                {new Date(item.appointmentEndTime).toLocaleTimeString()}
              </Text>
            </>
          )}
          {selectedCategory === 'Complete' && (
            <Text style={styles.rating}>
              ⭐ {item.rating} <Text style={styles.heart}>❤</Text>
            </Text>
          )}
        </View>
        <View style={styles.actionButtons}>
          {selectedCategory === 'Pending' ? (
            <>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.buttonText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.confirmButton}>✔</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.cancelButton}>✖</Text>
              </TouchableOpacity>
            </>
          ) : selectedCategory === 'Complete' ? (
            <>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.buttonText}>Re-Book</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => router.push('./addReview')}
              >
                <Text style={styles.buttonText}>Add Review</Text>
              </TouchableOpacity>
            </>
          ) : (
            selectedCategory === 'Cancelled' && (
              <TouchableOpacity style={styles.addReviewButton} onPress={() => router.push('./addReview')}>
                <Text style={styles.buttonText}>Add Review</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Appointments</Text>
      </View>

      <View style={styles.tabs}>
        {['Complete', 'Pending', 'Cancelled'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category as 'Complete' | 'Pending' | 'Cancelled')}
            style={[
              styles.tab,
              selectedCategory === category && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === category && styles.activeTabText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a73e8',
    textAlign: 'center',
    flex: 1,
    marginBottom:20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    marginBottom: 10,

  },
  activeTab: {
    backgroundColor: '#1a73e8',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    paddingLeft: 62, // Ensures proper alignment below the top row.
  },
  speciality: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#1a73e8',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#1a73e8',
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  heart: {
    color: '#f44336',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  detailsButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginLeft: 60,
  },
  addReviewButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 60,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confirmButton: {
    color: '#4caf50',
    fontSize: 20,
    marginHorizontal: 12,
  },
  cancelButton: {
    color: '#f44336',
    fontSize: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppointmentsScreen;
