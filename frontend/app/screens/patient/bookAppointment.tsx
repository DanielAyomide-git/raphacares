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

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  availableDate: string;
  reason: string;
  note: string;
}

const BookAppointment: React.FC = () => {
    const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    availableDate: '',
    reason: '',
    note: '',
  });

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

            {/* Available Date */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Available Date</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Date"
                    placeholderTextColor="gray"
                    value={formData.availableDate}
                    onChangeText={(text) => handleInputChange('availableDate', text)}
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
                <Text style={styles.label}>Additional information</Text>
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
            <TouchableOpacity style={styles.button} onPress={() => console.log(formData)}>
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
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    width: 80,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  phoneInput: {
    flex: 1,
    marginLeft: 5,
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
    marginRight:300
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