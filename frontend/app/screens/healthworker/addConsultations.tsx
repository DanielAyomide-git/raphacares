import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import axios from 'axios';

interface Prescription {
  medicine_name: string;
  dosage: string;
  duration: string;
  note: string;
}

interface ConsultationData {
  appointment_id: string | null;
  diagnosis: string;
  follow_up_start_date: string;
  follow_up_end_date: string;
  is_prescription_included: boolean;
  prescriptions: Prescription[];
}

const AddConsultations: React.FC = () => {
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [followUpStartDate, setFollowUpStartDate] = useState<string>('');
  const [followUpEndDate, setFollowUpEndDate] = useState<string>('');
  const [isPrescriptionIncluded, setIsPrescriptionIncluded] = useState<boolean>(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const router = useRouter();
  

  const handleDateChange = (text: string, setDate: React.Dispatch<React.SetStateAction<string>>) => {
    const formattedDate = text
      .replace(/[^0-9]/g, '') // Allow only numbers
      .replace(/^(\d{4})(\d{0,2})/, '$1-$2') // Insert first '-'
      .replace(/^(\d{4}-\d{2})(\d{0,2})/, '$1-$2'); // Insert second '-';
    setDate(formattedDate);
  };

  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine_name: '', dosage: '', duration: '', note: '' },
    ]);
  };

  const handlePrescriptionChange = (
    index: number,
    field: keyof Prescription,
    value: string
  ) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleSubmit = async () => {
    if (
      followUpStartDate.length !== 10 ||
      followUpEndDate.length !== 10 ||
      !followUpStartDate.match(/^\d{4}-\d{2}-\d{2}$/) ||
      !followUpEndDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      Alert.alert('Error', 'Please enter the dates in YYYY-MM-DD format.');
      return;
    }

    try {
      const appointmentId = await AsyncStorage.getItem('id');
      if (!appointmentId) {
        Alert.alert('Error', 'Appointment ID not found in storage.');
        return;
      }

      const data: ConsultationData = {
        appointment_id: appointmentId,
        diagnosis,
        follow_up_start_date: followUpStartDate,
        follow_up_end_date: followUpEndDate,
        is_prescription_included: isPrescriptionIncluded,
        prescriptions: isPrescriptionIncluded ? prescriptions : [],
      };

      await axios.post(
        'https://territorial-amaleta-cloobtech-7c903207.koyeb.app/api/v1/consultations/',
        data
      );
      

      Alert.alert('Success', 'Consultation submitted successfully!');
      router.push("./app");
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit consultation.');
    }
  };

  return (
    <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
      <Text style={styles.label}>Diagnosis:</Text>
      <TextInput
        style={styles.input}
        value={diagnosis}
        onChangeText={setDiagnosis}
        placeholder="Enter diagnosis"
        placeholderTextColor= "#999999"

      />

      <Text style={styles.label}>Follow-Up Start Date:</Text>
      <TextInput
        style={styles.input}
        value={followUpStartDate}
        onChangeText={(text) => handleDateChange(text, setFollowUpStartDate)}
        placeholder="YYYY-MM-DD"
        maxLength={10} // Restrict to 10 characters
        keyboardType="numeric"
        placeholderTextColor= "#999999"

        
      />

      <Text style={styles.label}>Follow-Up End Date:</Text>
      <TextInput
        style={styles.input}
        value={followUpEndDate}
        onChangeText={(text) => handleDateChange(text, setFollowUpEndDate)}
        placeholder="YYYY-MM-DD"
        maxLength={10} // Restrict to 10 characters
        keyboardType="numeric"
        placeholderTextColor= "#999999"

      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Include Prescription:</Text>
        <Switch
          value={isPrescriptionIncluded}
          onValueChange={setIsPrescriptionIncluded}
        />
      </View>

      {isPrescriptionIncluded && (
        <View>
          <Text style={styles.label}>Prescriptions:</Text>
          {prescriptions.map((prescription, index) => (
            <View key={index} style={styles.prescriptionContainer}>
              <TextInput
                style={styles.input}
                value={prescription.medicine_name}
                onChangeText={(value) =>
                  handlePrescriptionChange(index, 'medicine_name', value)
                }
                placeholder="Medicine Name"
                placeholderTextColor= "#999999"
                />
              <TextInput
                style={styles.input}
                value={prescription.dosage}
                onChangeText={(value) =>
                  handlePrescriptionChange(index, 'dosage', value)
                }
                placeholder="Dosage"
        placeholderTextColor= "#999999"

              />
              <TextInput
                style={styles.input}
                value={prescription.duration}
                onChangeText={(value) =>
                  handlePrescriptionChange(index, 'duration', value)
                }
                placeholder="Duration"
        placeholderTextColor= "#999999"

              />
              <TextInput
                style={styles.input}
                value={prescription.note}
                onChangeText={(value) =>
                  handlePrescriptionChange(index, 'note', value)
                }
                placeholder="Note"
        placeholderTextColor= "#999999"

              />
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={handleAddPrescription}>
            <Text style={styles.buttonText}>Add More Prescription</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Consultation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f9fc', marginTop:50 },
    label: { fontSize: 16, marginBottom: 8, fontWeight: 'bold',     marginRight: 30,
    },
  input: {
    borderWidth: 1,
    borderColor: '#FFB815',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 18,
    color: '#FFB815',
    marginRight: 50,
    fontWeight: "bold",
    marginBottom:30

  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prescriptionContainer: { marginBottom: 16 },
  button: {
    backgroundColor: '#FFB815',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default AddConsultations;
