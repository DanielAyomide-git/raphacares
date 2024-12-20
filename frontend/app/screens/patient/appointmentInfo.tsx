import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppointmentInfo: React.FC = () => {
  const navigation = useNavigation(); // Initialize navigation hook

  const [appointmentData, setAppointmentData] = useState<any>({});

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        // Fetch saved appointment details from AsyncStorage
        const practitionerType = await AsyncStorage.getItem('practitioner_type');
        const specialization = await AsyncStorage.getItem('specialization');
        const appointmentStartTime = await AsyncStorage.getItem('appointment_start_time');
        const appointmentReason = await AsyncStorage.getItem('appointment_reason');
        const fullName = await AsyncStorage.getItem('patient_name');
        const gender = await AsyncStorage.getItem('gender');
        const appointmentNote = await AsyncStorage.getItem('appointment_note');
        const profilePictureUrl = await AsyncStorage.getItem('profile_picture_url');
        
        setAppointmentData({
          practitionerType,
          specialization,
          appointmentStartTime,
          appointmentReason,
          fullName,
          gender,
          appointmentNote,
          profilePictureUrl,
        });
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    fetchAppointmentData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}> {/* Navigate back on press */}
          <Text style={styles.backButton}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Appointment Details</Text>
      </View>

      {/* Doctor Info Section */}
      <View style={styles.doctorInfo}>
        <Image
          source={{ uri: appointmentData.profilePictureUrl || 'https://via.placeholder.com/50' }} // Replace with actual image URL
          style={styles.doctorImage}
        />
        <View style={styles.doctorDetails}>
        <Text style={styles.doctorName}>
            {appointmentData.practitionerType ? appointmentData.practitionerType.charAt(0).toUpperCase() + appointmentData.practitionerType.slice(1) : 'Doctor'}
          </Text>
          <Text style={styles.doctorSpeciality}>{appointmentData.specialization || 'Specialization'}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ 5</Text>
            <Text style={styles.reviews}>60 Reviews</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>❤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Appointment Details Section */}
      <View style={styles.appointmentDetails}>
        <Text style={styles.appointmentDate}>{new Date(appointmentData.appointmentStartTime).toLocaleDateString()}</Text>
        <Text style={styles.appointmentTime}>{new Date(appointmentData.appointmentStartTime).toLocaleTimeString()}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmText}>✔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>✖</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Patient Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reason:</Text>
        <Text style={styles.sectionContent}>{appointmentData.appointmentReason || 'Not specified'}</Text>

        <Text style={styles.sectionTitle}>Full Name:</Text>
        <Text style={styles.sectionContent}>{appointmentData.fullName || 'Not specified'}</Text>

        <Text style={styles.sectionTitle}>Gender:</Text>
        <Text style={styles.sectionContent}>{appointmentData.gender || 'Not specified'}</Text>
      </View>

      {/* Problem Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note</Text>
        <Text style={styles.sectionContent}>
          {appointmentData.appointmentNote || 'No additional notes provided.'}
        </Text>
      </View>
    </ScrollView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 18,
    color: '#1a73e8',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    color: '#1a73e8',
    fontWeight: 'bold',
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
    marginRight: 10,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorSpeciality: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    fontSize: 16,
    color: '#666',
  },
  appointmentDetails: {
    backgroundColor: '#e8f0fe',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  appointmentDate: {
    fontSize: 16,
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#1a73e8',
    marginVertical: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  confirmButton: {
    marginRight: 10,
  },
  confirmText: {
    fontSize: 18,
    color: '#4caf50',
  },
  cancelButton: {},
  cancelText: {
    fontSize: 18,
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
