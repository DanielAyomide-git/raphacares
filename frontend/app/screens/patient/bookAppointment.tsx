import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { jwtDecode } from 'jwt-decode';
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
  type: string;
  street: string; // Added for home service
  city: string;   // Added for home service
  state: string;  // Added for home service
}

interface HealthCenter {
  id: string;
  name: string;
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
    type: '',
    street: '',
    city: '',
    state: ''
  });

  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);
  const [selectedHealthCenters, setSelectedHealthCenters] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHealthCenters = async () => {
      try {
        const centers = await AsyncStorage.getItem('health_centers');
        if (centers) {
          setHealthCenters(JSON.parse(centers));
        }
      } catch (error) {
        console.error('Error fetching health centers:', error);
      }
    };
    fetchHealthCenters();
  }, []);

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

  const handleHealthCenterSelection = (healthCenterId: string): void => {
    const updatedSelected = new Set(selectedHealthCenters);
    if (updatedSelected.has(healthCenterId)) {
      updatedSelected.delete(healthCenterId);
    } else {
      updatedSelected.add(healthCenterId);
    }
    setSelectedHealthCenters(new Set([healthCenterId]));
  };

  const handleSubmit = async (): Promise<void> => {
    if ( !formData.date || !formData.startTime || !formData.duration || !formData.reason || !formData.type ) {
      setErrorText('All fields are required');
        setTimeout(() => setErrorText(null), 2000);
      return;
    }
    if (formData.type === 'physical' && selectedHealthCenters.size === 0) {
      setErrorText('Please select a health center');
      setTimeout(() => setErrorText(null), 2000);
      return;
    }

    if (formData.type === 'home_service' && (!formData.street || !formData.city || !formData.state)) {
      setErrorText('Please fill out the address fields for home service');
      setTimeout(() => setErrorText(null), 2000);
      return;
    }

    setLoading(true); // Start loading when submitting

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

      const healthCenterIds = Array.from(selectedHealthCenters);

      const appointmentData = {
        patient_id: patientId,
        medical_practitioner_id: medicalPractitionerId,
        appointment_start_time: appointmentStartTime,
        appointment_end_time: appointmentEndTime,
        appointment_status: 'pending',
        appointment_reason: formData.reason,
        appointment_note: formData.note,
        appointment_type: formData.type,
        health_center_id: healthCenterIds.join(','),
        ...(formData.type === 'home_service' && {
          home_address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
          },
        }),
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
          type: '',
          street: '',
          city: '',
          state: '',
        });
        setSelectedHealthCenters(new Set());
        router.push('./app');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      setErrorText((error as Error).message || 'Slot is not available');
      setTimeout(() => setErrorText(null), 2000);
    } finally {
      setLoading(false); // Stop loading once done
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('./healthWorkerInfo')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
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

        {/* Appointment Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment Type</Text>
          <Picker
            selectedValue={formData.type}
            style={styles.pickerContainer}
            onValueChange={(itemValue) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                type: itemValue,
              }));
            }}>
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Online" value="online" />
            <Picker.Item label="Physical" value="physical" />
            <Picker.Item label="Home Service" value="home_service" />
          </Picker>
        </View>

        {/* Health Centers List (Shown when physical type is selected) */}
        {formData.type === 'physical' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Health Center</Text>
            <FlatList
              data={healthCenters}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.healthCenterItem}
                  onPress={() => handleHealthCenterSelection(item.id)}>
                  <Ionicons
                    name={selectedHealthCenters.has(item.id) ? 'checkmark' : 'square-outline'}
                    size={18}
                    color={selectedHealthCenters.has(item.id) ? 'white' : '#333'}
                    style={styles.checkbox}
                  />
                  <Text style={styles.healthCenterText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        {/* Home Address Fields (Shown when home service type is selected) */}
        {formData.type === 'home_service' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street</Text>
              <TextInput
                style={styles.input}
                placeholder="Street"
                placeholderTextColor="gray"
                value={formData.street}
                onChangeText={(text) => handleInputChange('street', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="gray"
                value={formData.city}
                onChangeText={(text) => handleInputChange('city', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="gray"
                value={formData.state}
                onChangeText={(text) => handleInputChange('state', text)}
              />
            </View>
          </>
        )}

        {/* Reason */}
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Book Now</Text>
          )}
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
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 60,
    color: '#00CDF9',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#00CDF9',
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
    alignContent: 'center',
    justifyContent: 'center',
  },
  healthCenterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    backgroundColor: '#00CDF9',
    borderRadius: 12,
    padding: 4,
    marginRight: 10,
  },
  healthCenterText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#00CDF9',
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
