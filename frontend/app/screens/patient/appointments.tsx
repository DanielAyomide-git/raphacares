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
  category: 'Completed' | 'Pending' | 'Cancelled' | 'Confirmed';
  appointmentStatus: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  appointmentNote: string;
  practitionerType: string;
}

const AppointmentsScreen: React.FC = () => {
  const router = useRouter(); // Initialize the router
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<'Completed' | 'Pending' | 'Cancelled' | 'Confirmed'>('Completed');

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
              appointment_note: "",
            };

            if (practitionerResponse.ok) {
              const practitionerData = await practitionerResponse.json();
              if (practitionerData.status === 'success' && practitionerData.data) {
                practitioner = {
                  name: `${practitionerData.data.first_name} ${practitionerData.data.last_name}`,
                  profile_picture_url: practitionerData.data.profile_picture_url,
                  practitioner_type: practitionerData.data.practitioner_type,
                  specialization: practitionerData.data.specialization,
                  appointment_note: practitionerData.data.appointment_note,

                };

              }
              

            }

            // Determine category based on appointment status
            const category: 'Completed' | 'Pending' | 'Cancelled' | 'Confirmed' = 
              appointment.appointment_status === 'completed'
                ? 'Completed'
                : appointment.appointment_status === 'pending'
                ? 'Pending'
                : appointment.appointment_status === 'cancelled'
                ? 'Cancelled'
                : appointment.appointment_status === 'confirmed'
                ? 'Confirmed'
                : 'Pending'; 

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
              appointmentNote: appointment.appointment_note,
              practitionerType: practitioner.practitioner_type
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
            source={{ uri: item.imageUrl || 'https://img.icons8.com/?size=100&id=11730&format=png&color=000000'}}
            style={styles.doctorImage}
          />
      <Text style={styles.doctorName}>
        {item.practitionerType.charAt(0).toUpperCase() + item.practitionerType.slice(1)}{' '}
        {item.doctorName.charAt(0).toUpperCase() + item.doctorName.slice(1)}
      </Text>
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
          {selectedCategory === 'Completed' && (
            <Text style={styles.rating}>
              ⭐ {item.rating} <Text style={styles.heart}>❤</Text>
            </Text>
          )}
        </View>
        <View style={styles.actionButtons}>
  {selectedCategory === 'Pending' ? (
    <>
      <TouchableOpacity
        style={[styles.actionButton, styles.detailsButton]}
        onPress={async () => {
          const appointmentDetails = {
            id: item.id,
            doctorName: item.doctorName,
            speciality: item.speciality,
            imageUrl: item.imageUrl || 'https://img.icons8.com/?size=100&id=11730&format=png&color=000000',
            rating: item.rating,
            category: item.category,
            appointmentStatus: item.appointmentStatus,
            appointmentStartTime: item.appointmentStartTime,
            appointmentEndTime: item.appointmentEndTime,
            appointmentNote: item.appointmentNote,
            practitionerType: item.practitionerType,
          };

          try {
            await AsyncStorage.setItem('appointmentDetails', JSON.stringify(appointmentDetails));
            console.log('Appointment details saved for Details screen:', appointmentDetails);

            // Navigate to appointmentDetails screen
            router.push('./appointmentDetails');
          } catch (error) {
            console.error('Error saving appointment details to AsyncStorage:', error);
          }
        }}
      >
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </>
  ) : selectedCategory === 'Completed' ? (
    <>
      <TouchableOpacity
        style={[styles.actionButton, styles.addReviewButton]}
        onPress={async () => {
          const appointmentDetails = {
            id: item.id,
            doctorName: item.doctorName,
            speciality: item.speciality,
            imageUrl: item.imageUrl || 'https://img.icons8.com/?size=100&id=11730&format=png&color=000000g',
            rating: item.rating,
            category: item.category,
            appointmentStatus: item.appointmentStatus,
            appointmentStartTime: item.appointmentStartTime,
            appointmentEndTime: item.appointmentEndTime,
            appointmentNote: item.appointmentNote,
            practitionerType: item.practitionerType,
          };

          try {
            await AsyncStorage.setItem('appointmentDetails', JSON.stringify(appointmentDetails));
            console.log('Appointment details saved for review:', appointmentDetails);

            router.push('./addReview');
          } catch (error) {
            console.error('Error saving appointment details to AsyncStorage:', error);
          }
        }}
      >
        <Text style={styles.buttonText}>Add Review</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.rebookButton]}
        onPress={() => router.push('./services')}
      >
        <Text style={styles.buttonText}>Re-Book</Text>
      </TouchableOpacity>
    </>
  ) : selectedCategory === 'Confirmed' ? (
    <>
      <TouchableOpacity
        style={[styles.actionButton, styles.detailsButton]}
        onPress={async () => {
          const appointmentDetails = {
            id: item.id,
            doctorName: item.doctorName,
            speciality: item.speciality,
            imageUrl: item.imageUrl || 'https://img.icons8.com/?size=100&id=11730&format=png&color=000000',
            rating: item.rating,
            category: item.category,
            appointmentStatus: item.appointmentStatus,
            appointmentStartTime: item.appointmentStartTime,
            appointmentEndTime: item.appointmentEndTime,
            appointmentNote: item.appointmentNote,
            practitionerType: item.practitionerType,
          };

          try {
            await AsyncStorage.setItem('appointmentDetails', JSON.stringify(appointmentDetails));
            console.log('Appointment details saved for Details screen:', appointmentDetails);

            router.push('./appointmentDetails');
          } catch (error) {
            console.error('Error saving appointment details to AsyncStorage:', error);
          }
        }}
      >
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.payButton]}
        onPress={() => router.push('./payment')}
      >
        <Text style={styles.buttonText}>Pay</Text>
      </TouchableOpacity>
    </>
  ) : (
    selectedCategory === 'Cancelled' && (
      <TouchableOpacity
        style={[styles.actionButton, styles.addReviewButton]}
        onPress={() => router.push('./addReview')}
      >
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
        <ActivityIndicator size="large" color="#00CDF9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Appointments</Text>
      </View>

      <View style={styles.tabs}>
        {['Completed', 'Pending', 'Confirmed', 'Cancelled'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category as 'Completed' | 'Pending' | 'Confirmed'| 'Cancelled' )}
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
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:50
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00CDF9',
    textAlign: 'center',
    flex: 1,
    marginBottom:20,
    marginTop: 25
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 6, // Reduced vertical padding
    paddingHorizontal: 12, // Reduced horizontal padding
    borderRadius: 8, // Smaller border radius for a compact look
    backgroundColor: '#F2F2F2',
    marginBottom: 10,
  },
  activeTab: {
    backgroundColor: '#00CDF9',
  },
  tabText: {
    fontSize: 12, // Reduced font size
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },

  listContainer: {
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#ccf6ff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: 'black',  // Set the shadow color to #9f9f9f
    shadowOffset: { width: 0, height: 4 },  // Set the shadow's offset (distance)
    shadowOpacity: 0.3,  // Control shadow transparency
    shadowRadius: 6,  // Set the blur radius of the shadow
    elevation: 8,  // Ensure shadow appears on Android devices
  },
  
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  doctorImage: {
    width: 50,
    height: 40,
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
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
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
  actionButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16, // Standardized padding for all buttons
    marginRight: 10,
  },
  detailsButton: {
    backgroundColor: '#00CDF9',
    marginLeft:60
  },
  addReviewButton: {
    backgroundColor: '#00CDF9',
    marginLeft:60,
  },
  rebookButton: {
    backgroundColor: '#6ebf70',
  },
  payButton: {
    backgroundColor: '#6ebf70',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppointmentsScreen;
