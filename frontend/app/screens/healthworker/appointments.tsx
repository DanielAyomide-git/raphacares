import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from "../../api/config";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  rating: number;
  imageUrl: string;
  category: 'Completed' | 'Pending' | 'Cancelled' | 'Confirmed';
  appointmentStatus: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  appointmentNote: string;
  appointmentType: string;
  patientType: string;
  healthCenter: string;
  created: string;
}

const AppointmentsScreen: React.FC = () => {
  
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<'Completed' | 'Pending' | 'Cancelled' | 'Confirmed'>('Completed');
  const [profileId, setProfileId] = useState<string | null>(null); // Store profile_id
  const [showCancelModal, setShowCancelModal] = useState(false); // Modal visibility state
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null); // Appointment to cancel


  // Fetch appointments and patient data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
          throw new Error('Token not found');
        }

        // Decode JWT to get profile_id
        const decodedToken: any = jwtDecode(token);
        const profileIdFromToken = decodedToken?.profile_id;
        setProfileId(profileIdFromToken);

        if (!profileIdFromToken) {
          throw new Error('Profile ID not found in token');
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
            // Filter appointments by profile_id
            if (appointment.medical_practitioner_id !== profileIdFromToken) {
              return null;
            }

            // Fetch  patient details
            const patientResponse = await fetch(
              `${API_BASE_URL}/patients/${appointment.patient_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            let patient = {
              name: "Unknown patient",
              profile_picture_url: "https://via.placeholder.com/100",
              appointment_note: "",
            };

            if (patientResponse.ok) {
              const patientData = await patientResponse.json();
              if (patientData.status === 'success' && patientData.data) {
                patient = {
                  name: `${patientData.data.first_name} ${patientData.data.last_name}`,
                  profile_picture_url: patientData.data.profile_picture_url,
                  appointment_note: patientData.data.appointment_note,
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
              patientName: patient.name,
              imageUrl: patient.profile_picture_url,
              rating: 5, // Hardcoded as an example, can be adjusted accordingly
              category: category,
              appointmentStatus: appointment.appointment_status,
              appointmentStartTime: appointment.appointment_start_time,
              appointmentEndTime: appointment.appointment_end_time,
              appointmentType: appointment.appointment_type,
              created: appointment.created_at,
              appointmentNote: appointment.appointment_note,
              healthCenter: appointment.health_center,
            };
          }));

          // Filter out null values (appointments not matching profile_id)
          setAppointments(appointmentsWithDetails.filter((a) => a !== null) as Appointment[]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments
  .filter((appointment) => appointment.category === selectedCategory)
  .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    return (
      <View style={styles.appointmentCard}>
        <View style={styles.topRow}>
          <Image
            source={{ uri: item.imageUrl || 'https://img.icons8.com/?size=100&id=11730&format=png&color=000000'}}
            style={styles.doctorImage}
          />
          <Text style={styles.patientName}>
            {item.patientName.charAt(0).toUpperCase() + item.patientName.slice(1)}
          </Text>
          
        </View>
        
        <View style={styles.detailsContainer}>
          {selectedCategory === 'Pending' && (
            <>
              <Text style={styles.date}>
                {new Date(item.appointmentStartTime).toDateString()}
              </Text>
              <Text style={styles.time}>
                {new Date(item.appointmentStartTime).toLocaleTimeString()} -{' '}
                {new Date(item.appointmentEndTime).toLocaleTimeString()}
              </Text>
              <Text style={styles.type}>
                Appointment Type: {item.appointmentType}
              </Text>
              <Text style={styles.type}>
                Appointment Venue: 
              </Text>
            </>
          )}
          
         
        </View>
        <View style={styles.actionButtons}>
        {selectedCategory === 'Completed' ? (
            <>
            
             <View style={styles.detailsContainer}>
            <>
              <Text style={styles.date}>
                {new Date(item.appointmentStartTime).toDateString()}
              </Text>
              <Text style={styles.time}>
                {new Date(item.appointmentStartTime).toLocaleTimeString()} -{' '}
                {new Date(item.appointmentEndTime).toLocaleTimeString()}
              </Text>
              <Text style={styles.type}>
                Appointment Type: {item.appointmentType}
              </Text>
              <Text style={styles.type}>
                Appointment Venue: 
              </Text>
            </>
          
         
        </View>
        
  
             
            </>
          ) : selectedCategory === 'Confirmed' ? (
            <>
               <View style={styles.detailsContainer}>
                
            <>
              <Text style={styles.date}>
                {new Date(item.appointmentStartTime).toDateString()}
              </Text>
              <Text style={styles.time}>
                {new Date(item.appointmentStartTime).toLocaleTimeString()} -{' '}
                {new Date(item.appointmentEndTime).toLocaleTimeString()}
              </Text>
              <Text style={styles.type}>
                Appointment Type: {item.appointmentType}
              </Text>
              <Text style={styles.type}>
                Appointment Venue: 
              </Text>
            </>
          
         
        </View>
        
              
  
             
            </>
          ) : (
            selectedCategory === 'Cancelled' && (
              
              <View style={styles.detailsContainer}>
                
              <>
                <Text style={styles.date}>
                  {new Date(item.appointmentStartTime).toDateString()}
                </Text>
                <Text style={styles.time}>
                  {new Date(item.appointmentStartTime).toLocaleTimeString()} -{' '}
                  {new Date(item.appointmentEndTime).toLocaleTimeString()}
                </Text>
                <Text style={styles.type}>
                  Appointment Type: {item.appointmentType}
                </Text>
                <Text style={styles.type}>
                  Appointment Venue: 
                </Text>
              </>
            
           
          </View>
              
              
            )
            
          )}
          
        </View>
      </View>
    );
  };


  
  
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="yellow" />
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
            onPress={() => setSelectedCategory(category as 'Completed' | 'Pending' | 'Confirmed' | 'Cancelled')}
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

      {filteredAppointments.length === 0 ? (
  <View style={styles.noAppointmentsContainer}>
    <Image
      source={{ uri: 'https://img.icons8.com/?size=100&id=59707&format=png' }} // Example placeholder image
      style={styles.noAppointmentsImage}
    />
    <Text style={styles.noAppointmentsText}>
      No appointments found in this category.
    </Text>
  </View>
) : (
  <FlatList
    data={filteredAppointments}
    renderItem={renderAppointmentItem}
    keyExtractor={(item) => item.id}
    contentContainerStyle={styles.listContainer}
  />
)}

    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Optional: Adjust based on design
  },
  noAppointmentsImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    tintColor: '#ccc', // Optional: Adjust color for a softer look
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom:200 // Optional: For padding around the text
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
    marginTop:10
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFB815',
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
    backgroundColor: '#FFB815',
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
    backgroundColor: '#fff6e0',
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
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    paddingLeft: 62, // Ensures proper alignment below the top row.
  },
 
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: 'black',
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
    backgroundColor: '#FFB815',
    marginLeft:60
  },
  addReviewButton: {
    backgroundColor: '#FFB815',
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
    backgroundColor: "#FFFFFF",

  },
});

export default AppointmentsScreen;
