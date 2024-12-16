import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DecodedToken {
  profile_id: string;
  id: string;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  reason: string;
  note: string;
}

const BookAppointment: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    appointmentStartTime: '',
    appointmentEndTime: '',
    reason: '',
    note: '',
  });

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Get medical practitioner ID from AsyncStorage
      const medicalPractitionerId = await AsyncStorage.getItem('medical_practitioner_id');

      // Get patient ID from decoded JWT token
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('Token is missing');

      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const patientId = decodedToken.profile_id;

      // Join appointment date and time
      const appointmentStartDateTime = `${formData.appointmentStartTime} ${formData.appointmentEndTime}`;

      // Prepare data for the API call
      const appointmentData = {
        patient_id: patientId,
        medical_practitioner_id: medicalPractitionerId,
        appointment_start_time: appointmentStartDateTime,
        appointment_end_time: appointmentStartDateTime,
        reason: formData.reason,
        note: formData.note,
        appointment_status: 'pending', // Default status
      };

      // Make API call to submit the appointment
      const response = await fetch('http://127.0.0.1:8000/api/v1/appointments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      // Handle successful appointment booking
      console.log('Appointment booked successfully');
      // Redirect or show success message
      router.push('./app');
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('./healthWorkerInfo')}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Appointment Form</Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="eg: John Doe"
            placeholderTextColor="gray"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="eg: john@email.com"
            placeholderTextColor="gray"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="gray"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Appointment Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="gray"
            value={formData.appointmentStartTime}
            onChangeText={(text) => handleInputChange('appointmentStartTime', text)}
          />
        </View>

        {/* Appointment Start Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment Start Time</Text>
          <TextInput
            style={styles.input}
            placeholder="MM:SS"
            placeholderTextColor="gray"
            value={formData.appointmentStartTime}
            onChangeText={(text) => handleInputChange('appointmentStartTime', text)}
          />
        </View>

        {/* Appointment End Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment End Time</Text>
          <TextInput
            style={styles.input}
            placeholder="MM:SS"
            placeholderTextColor="gray"
            value={formData.appointmentEndTime}
            onChangeText={(text) => handleInputChange('appointmentEndTime', text)}
          />
        </View>

        {/* Appointment Reason */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment Reason</Text>
          <TextInput
            style={[styles.input, styles.textArea1]}
            placeholder="Reason"
            placeholderTextColor="gray"
            value={formData.reason}
            onChangeText={(text) => handleInputChange('reason', text)}
            multiline
          />
        </View>

        {/* Additional Information */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Information</Text>
          <TextInput
            style={[styles.input, styles.textArea2]}
            placeholder="Note"
            placeholderTextColor="gray"
            value={formData.note}
            onChangeText={(text) => handleInputChange('note', text)}
            multiline
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 60,
    color: '#007bff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#007bff',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea1: {
    height: 50,
    textAlignVertical: 'top',
  },
  textArea2: {
    height: 100,
    textAlignVertical: 'top',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
    marginRight: 300,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BookAppointment;
