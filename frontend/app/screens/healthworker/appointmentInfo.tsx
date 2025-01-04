import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface AppointmentData {
  profilePictureUrl?: string;
  patient_first_name?: string;
  patient_last_name?: string;
  phone_number?: string;
  patient_id?: string;
  id?: string;
  patient_gender?: string;
  patient_date_of_birth?: string; // ISO date string
  appointment_start_time?: string; // ISO date string
  appointment_end_time?: string; // ISO date string
  address?: string; // ISO date string
  appointment_reason?: string;
  appointment_note?: string;
  appointment_type?: string;
  appointment_status?: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  medical_practitioner_id?: string; // Added medical_practitioner_id
}

const AppointmentInfo: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [appointmentData, setAppointmentData] = useState<AppointmentData>({});
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('appointmentData');
        if (storedData) {
          setAppointmentData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  // Helper function to calculate age from date of birth
  const calculateAge = (dob?: string): string => {
    if (!dob) return 'Not specified';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Function to handle status update and API call
  const handleStatusChange = async (newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    if (!appointmentData.id) return;

    setLoading(true); // Start loading

    // Prepare data to send to the API
    const data = {
      patient_id: appointmentData.patient_id,
      appointment_status: newStatus,
      medical_practitioner_id: appointmentData.medical_practitioner_id,
    };

    try {
      const response = await fetch(`https://territorial-amaleta-cloobtech-7c903207.koyeb.app/api/v1/appointments/${appointmentData.id}?get_health_centers=true`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // On success, update the local state and redirect
        setAppointmentData((prevState) => ({
          ...prevState,
          appointment_status: newStatus,
        }));
        router.push('./app');
      } else {
        console.error('Failed to update appointment status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleBeginConsultation = () => {
    router.push('./chats'); // Redirect to message page
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Patient Info Section */}

<View style={styles.doctorInfo}>
  <Image
    source={{ uri: appointmentData.profilePictureUrl || 'https://img.icons8.com/?size=100&id=11730&format=png&color=000000' }}
    style={styles.doctorImage}
  />
  <View style={styles.doctorDetails}>
    <Text style={styles.doctorName}>
      {appointmentData.patient_first_name && appointmentData.patient_last_name
        ? `${appointmentData.patient_first_name} ${appointmentData.patient_last_name}`
        : 'Name'}
    </Text>
  </View>

  {/* Conditionally render the online button if conditions are met */}
{(appointmentData.appointment_type === 'online' && (appointmentData.appointment_status === 'confirmed' || appointmentData.appointment_status === 'completed')) && (
    <TouchableOpacity style={styles.onlineButton}
    onPress={() => router.push("./chats")}
    >
      <Image
        source={{ uri: 'https://img.icons8.com/?size=100&id=85701&format=png&color=000000' }}
        style={styles.onlineButtonIcon}
      />
    </TouchableOpacity>
  )}
</View>


      {/* Appointment Details Section */}
      <View style={styles.appointmentDetails}>
        <Text style={styles.appointmentDate}>
          {appointmentData.appointment_start_time
            ? new Date(appointmentData.appointment_start_time).toLocaleDateString()
            : 'Date not available'}
        </Text>

        <Text style={styles.appointmentTime}>
          {appointmentData.appointment_start_time && appointmentData.appointment_end_time
            ? `${new Date(appointmentData.appointment_start_time).toLocaleTimeString()} - ${new Date(
                appointmentData.appointment_end_time
              ).toLocaleTimeString()}`
            : 'Time not available'}
        </Text>
      </View>

      {/* Patient Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reason:</Text>
        <Text style={styles.sectionContent}>{appointmentData.appointment_reason || 'Not specified'}</Text>

        <Text style={styles.sectionTitle}>Gender:</Text>
        <Text style={styles.sectionContent}>{appointmentData.patient_gender || 'Not specified'}</Text>
        <Text style={styles.sectionTitle}>Phone Number:</Text>
        <Text style={styles.sectionContent}>{appointmentData.phone_number || 'Not specified'}</Text>

        <Text style={styles.sectionTitle}>Age:</Text>
        <Text style={styles.sectionContent}>{calculateAge(appointmentData.patient_date_of_birth)}</Text>
         {/* Problem Description Section */}
         <Text style={styles.sectionTitle}>Note:</Text>
        <Text style={styles.sectionContent}>
          {appointmentData.appointment_note || 'No additional notes provided.'}
        </Text>
        <Text style={styles.sectionTitle}>Appointment Type:</Text>
        <Text style={styles.sectionContent}>
          {appointmentData.appointment_type || ''}
        </Text>
      </View>

     

      {/* Conditional Action Buttons */}
      {appointmentData.appointment_status === 'pending' ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() => handleStatusChange('confirmed')}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => handleStatusChange('cancelled')}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cancel</Text>}
          </TouchableOpacity>
        </View>
      ) : appointmentData.appointment_status === 'confirmed' ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={() => handleStatusChange('completed')}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Complete Appointment</Text>}
          </TouchableOpacity>
        </View>
      ) : appointmentData.appointment_status === 'cancelled' ? (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, styles.statusCancelled]}>
            Status: CANCELLED
          </Text>
        </View>
      ) : appointmentData.appointment_status === 'completed' ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.consultButton]} onPress={handleBeginConsultation}>
            <Text style={styles.buttonText}> Consultations</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    fontSize: 18,
    color: '#00cdf9',
    marginRight: 50,
  },
  onlineButton: {
    marginLeft: 10, // Space between the name and the button
    justifyContent: 'center',
    alignItems: 'center',
    width: 30, // Adjust the width to match the icon size
    height: 30, // Adjust the height to match the icon size
    borderRadius: 15, // Make it circular
    backgroundColor: '#ffffff', // You can change the background color
    borderWidth: 1,
    borderColor: '#ddd', // Light border color for contrast
  },
  onlineButtonIcon: {
    width: 20, // Icon size
    height: 20, // Icon size
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB815',
  },
  appointmentDetails: {
    backgroundColor: '#ebebeb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  appointmentDate: {
    fontSize: 16,
    color: '#FFB815',
    fontWeight: 'bold',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#FFB815',
    marginVertical: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: '#4caf50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  completeButton: {
    backgroundColor: '#2196f3',
  },
  consultButton: {
    backgroundColor: '#00BCD4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  statusCancelled: {
    color: '#f44336',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
});

export default AppointmentInfo;
