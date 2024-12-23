import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function AppointmentInfo() {
  const navigation = useNavigation(); // Initialize navigation hook
  const router = useRouter();

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
        const id = await AsyncStorage.getItem('appointment_id');
        const appointmentStatus = await AsyncStorage.getItem('appointment_status');
        const profilePictureUrl = await AsyncStorage.getItem('practitioner_profile_picture_url');
        const practitionerName = await AsyncStorage.getItem('practitioner_name');

        // Log fetched data for debugging
        console.log("Fetched Appointment Data:", {
          practitionerType,
          practitionerName,
          specialization,
          appointmentStartTime,
          appointmentReason,
          fullName,
          gender,
          appointmentNote,
          profilePictureUrl,
          appointmentStatus,
          id,
        });

        setAppointmentData({
          practitionerType,
          practitionerName,
          specialization,
          appointmentStartTime,
          appointmentReason,
          fullName,
          gender,
          appointmentNote,
          profilePictureUrl,
          appointmentStatus,
          id
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Doctor Info Section */}
      <View style={styles.doctorInfo}>
        <Image
          source={{ uri: appointmentData.profilePictureUrl || "https://img.icons8.com/?size=100&id=11730&format=png&color=000000" }}
          style={styles.doctorImage}
        />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>
            {/* Ensure practitionerName exists, otherwise fallback to 'Name' */}
             
            {appointmentData.practitionerType
              ? appointmentData.practitionerType.charAt(0).toUpperCase() + appointmentData.practitionerType.slice(1)
              : 'Doctor'} {appointmentData.practitionerName ? appointmentData.practitionerName : 'Name'}
          </Text>
          <Text style={styles.doctorSpeciality}>{appointmentData.specialization || 'Specialization'}</Text>
        </View>
      </View>

      {/* Appointment Details Section */}
      <View style={styles.appointmentDetails}>
        <Text style={styles.appointmentDate}>
          {appointmentData.appointmentStartTime
            ? new Date(appointmentData.appointmentStartTime).toLocaleDateString()
            : 'Date not available'}
        </Text>

        <Text style={styles.appointmentTime}>
          {appointmentData.appointmentStartTime
            ? new Date(appointmentData.appointmentStartTime).toLocaleTimeString()
            : 'Time not available'}
        </Text>

        {/* Conditional Action Buttons */}
        {appointmentData.appointmentStatus === "confirmed" ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.confirmButton} onPress={() => router.push('./payment')}>
              <Text style={styles.confirmText}>Pay</Text>
            </TouchableOpacity>
            <Text style={styles.or}>| </Text>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : appointmentData.appointmentStatus === "pending" ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <Text
              style={[styles.statusText, 
                appointmentData.appointmentStatus === "completed"
                  ? styles.statusCompleted
                  : appointmentData.appointmentStatus === "cancelled"
                  ? styles.statusCancelled
                  : null,
              ]}
            >
              Status: {appointmentData.appointmentStatus ? appointmentData.appointmentStatus.toUpperCase() : 'N/A'}
            </Text>
          </View>
        )}
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
  headerTitle: {
    fontSize: 24,
    color: '#00CDF9',
    fontWeight: 'bold',
    marginTop: 90,

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
    color: '#00CDF9',
  },
  doctorSpeciality: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  appointmentDetails: {
    backgroundColor: '#ebebeb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  appointmentDate: {
    fontSize: 16,
    color: '#00CDF9',
    fontWeight: 'bold',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#00CDF9',
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
    fontWeight: "bold",
  },
  or: {
    fontSize: 18,
    color: 'black',
    fontWeight: "bold",
  },
  cancelButton: {},
  cancelText: {
    fontSize: 18,
    color: '#f44336',
    fontWeight: "bold",
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
  statusCompleted: {
    color: '#4caf50', 
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
