import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


interface Appointment {
  consultation?: Consultation;
}

interface Consultation {
  id: string;
  diagnosis: string;
  follow_up_start_date: string;
  follow_up_end_date: string;
  prescriptions: Prescription[];
}

interface Prescription {
  id: string;
  medicine_name: string;
  dosage: string;
  duration: string;
  note: string;
}


const Consultations: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [appointmentData, setAppointmentData] = useState<Appointment | null>(
    null
  );
  const [consultationData, setConsultationData] = useState<Consultation | null>(
    null
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [error, setError] = useState<string>("");

  const fetchConsultationData = async () => {
    try {
      setLoading(true);
      setError("");

      const id = await AsyncStorage.getItem("id");
      if (!id) {
        setError("No ID found in storage.");
        setLoading(false);
        return;
      }

      const appointmentResponse = await fetch(
        `https://territorial-amaleta-cloobtech-7c903207.koyeb.app/api/v1/appointments/${id}?get_consultation=true`
      );
      const appointmentJson = await appointmentResponse.json();
      if (appointmentJson.status !== "success") {
        setError("Failed to fetch appointment data.");
        setLoading(false);
        return;
      }

      const appointment: Appointment = appointmentJson.data;
      setAppointmentData(appointment);

      if (!appointment.consultation) {
        setConsultationData(null);
        setLoading(false);
        return;
      }

      const consultationId = appointment.consultation.id;
      const consultationResponse = await fetch(
        `https://territorial-amaleta-cloobtech-7c903207.koyeb.app/api/v1/consultations/${consultationId}`
      );
      const consultationJson = await consultationResponse.json();
      if (consultationJson.status !== "success") {
        setError("Failed to fetch consultation data.");
        setLoading(false);
        return;
      }

      const consultation: Consultation = consultationJson.data;
      setConsultationData(consultation);

      const prescriptionData = await Promise.all(
        consultation.prescriptions.map(async (prescription) => {
          const prescriptionResponse = await fetch(
            `https://territorial-amaleta-cloobtech-7c903207.koyeb.app/api/v1/prescriptions/${prescription.id}`
          );
          const prescriptionJson = await prescriptionResponse.json();
          return prescriptionJson.data as Prescription;
        })
      );

      setPrescriptions(prescriptionData);
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultationData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="yellow" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!consultationData) {
    return (
      <View style={styles.center}>
      
  <Text style={styles.noDataText}>No consultation found</Text>
  <TouchableOpacity
    style={styles.button}
    onPress={() => router.push("./addConsultations")}
  >
    <Text style={styles.buttonText}>Add Consultation</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.goBack}>Go back</Text>
      </TouchableOpacity>
</View>

    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Consultations</Text>
        {/* <TouchableOpacity  onPress={() =>router.push("./addConsultations") }>
          <Image
            source={{
              uri: "https://img.icons8.com/?size=100&id=24717&format=png&color=000000",
            }}
            style={styles.icon}
           
          />
        </TouchableOpacity> */}
      </View>

      <Text style={styles.label}>Diagnosis: {consultationData.diagnosis}</Text>
      <Text style={styles.label}>
        Follow-up Start Date:{" "}
        {new Date(consultationData.follow_up_start_date).toLocaleDateString()}
      </Text>
      <Text style={styles.label}>
        Follow-up End Date:{" "}
        {new Date(consultationData.follow_up_end_date).toLocaleDateString()}
      </Text>

      <Text style={styles.subTitle}>Prescriptions:</Text>
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.medicine_name}</Text>
            <Text style={styles.cardLabel}>Dosage: {item.dosage}</Text>
            <Text style={styles.cardLabel}>Duration: {item.duration}</Text>
            <Text style={styles.cardLabel}>Note: {item.note}</Text>
          </View>
        )}
      />

     
<TouchableOpacity
  style={styles.button}
  onPress={async () => {
    if (consultationData?.id) {
      await AsyncStorage.setItem("consultation_id", consultationData.id);
      router.push("./updateConsultation");
    } else {
     console.log("Error", "No consultation ID found.");
    }
  }}
>
  <Text style={styles.buttonText}>Update Consultation</Text>
</TouchableOpacity>


    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    marginTop: 60,

  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFB815",
    marginBottom: 10,

  },
  backButton: {
    fontSize: 18,
    color: '#FFB815',
    marginRight: 50,
    fontWeight: "bold",

  },
  goBack: {
    fontSize: 18,
    color: '#FFB815',
    fontWeight: "bold",
     alignItems: "center",
    justifyContent: "center",

  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFB815",
    marginVertical: 12,
  },
  button: {
    backgroundColor: "#FFB815",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom:30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 18,
    color: "#FFB815",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#FFB815",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFB815",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: "black",
    marginBottom: 4,
  },
  icon: {
    width: 30,
    height: 30,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default Consultations;


