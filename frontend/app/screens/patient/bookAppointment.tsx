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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import {jwtDecode} from 'jwt-decode';
import { API_BASE_URL } from '../../api/config'; // Adjust the path as needed


interface DecodedToken {
  profile_id: string;
  id: string;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  duration: string;
  reason: string;
  note: string;
}

const BookAppointment: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    date: '',
    startTime: '',
    duration: '',
    reason: '',
    note: '',
  });

  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (input: string): void => {
    const cleaned = input.replace(/[^0-9]/g, '');
    let formatted = cleaned;

    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    if (cleaned.length > 6) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6)}`;
    }

    setFormData((prev) => ({ ...prev, date: formatted.slice(0, 10) }));
  };

  const handleTimeChange = (input: string): void => {
    const cleaned = input.replace(/[^0-9]/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    }

    setFormData((prev) => ({ ...prev, startTime: formatted.slice(0, 5) }));
  };

  const calculateEndTime = (startTime: string, duration: string): string => {
    if (!startTime || !duration) return '';

    const [hours, minutes] = startTime.split(':').map(Number);
    const durationHours = parseInt(duration, 10);

    if (isNaN(hours) || isNaN(minutes) || isNaN(durationHours)) return '';

    const endDateTime = new Date();
    endDateTime.setHours(hours + durationHours, minutes);

    return `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const handleDurationChange = (duration: string): void => {
    const endTime = calculateEndTime(formData.startTime, duration);
    setFormData((prev) => ({ ...prev, duration, endTime }));
  };

  const handleSubmit = async (): Promise<void> => {
    

    try {
      const medicalPractitionerId = await AsyncStorage.getItem('medical_practitioner_id');
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('Token is missing');

      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const patientId = decodedToken.profile_id;

      const appointmentStartTime = `${formData.date}T${formData.startTime}`;
      const appointmentEndTime = `${formData.date}T${calculateEndTime(
        formData.startTime,
        formData.duration
      )}`;

      const appointmentData = {
        patient_id: patientId,
        medical_practitioner_id: medicalPractitionerId,
        appointment_start_time: appointmentStartTime,
        appointment_end_time: appointmentEndTime,
        appointment_status: 'pending',
        appointment_reason: formData.reason,
        appointment_note: formData.note,
      };
      const endpoint = `${API_BASE_URL}/appointments/`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage: string = errorData?.detail || 'An error occurred. Please try again.';
        throw new Error(errorMessage);
      }

      setSuccessText('Appointment booked successfully');
      setTimeout(() => {
        setSuccessText(null);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          date: '',
          startTime: '',
          duration: '',
          reason: '',
          note: '',
        });
        router.push('./app');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setErrorText((error as Error).message || 'Slot is not available');
      setTimeout(() => setErrorText(null), 2000);
    }
  };




  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('./healthWorkerInfo')}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Appointment Form</Text>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="gray"
            value={formData.date}
            onChangeText={handleDateChange}
            maxLength={10}
            keyboardType="number-pad"
          />
        </View>

        {/* Start Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Time (HH:MM)</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor="gray"
            value={formData.startTime}
            onChangeText={handleTimeChange}
            maxLength={5}
            keyboardType="number-pad"
          />
        </View>

        {/* Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration (Hours)</Text>
          <Picker
            selectedValue={formData.duration}
            onValueChange={handleDurationChange}
            style={styles.pickerContainer}>
            <Picker.Item label="Select Duration" value="" />
            <Picker.Item label="1 Hour" value="1" />
            <Picker.Item label="2 Hours" value="2" />
            <Picker.Item label="3 Hours" value="3" />
          </Picker>
        </View>

        {/* Appointment Reason */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reason</Text>
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


        {errorText && <Text style={styles.errorText}>{errorText}</Text>}
        {successText && <Text style={styles.successText}>{successText}</Text>}

       

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
  textArea: {
    height: 100, // Set height to make it larger for multiline input
    borderColor: '#ccc', // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Rounded corners
    padding: 10, // Inner padding for better readability
    fontSize: 16, // Adjust font size
    color: '#333', // Text color
    backgroundColor: '#f9f9f9', // Optional: Light background for better contrast
    textAlignVertical: 'top', // Align text to the top for multiline
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

  inputDate: {
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 0,
    backgroundColor: 'white',
    marginLeft: 15,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 15,
    color: '#333',
    alignContent: "center",
    justifyContent: "center"
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
    alignItems: "center"

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
  errorText: {
    color: 'red',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default BookAppointment;
