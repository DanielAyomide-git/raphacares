import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';


const AddCard = () => {
      const router = useRouter(); // Expo Router for navigation
    
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}
          style={styles.backButton}
          >
        <Ionicons name="arrow-back" size={24} color="#00CDF9" />
      </TouchableOpacity>
      <Text style={styles.title}>Add Card</Text>
      </View>
     
     
      {/* Card Display */}
      <View style={styles.card}>
        <Text style={styles.cardNumber}>0000 0000 0000 00</Text>
        <View style={styles.cardDetails}>
          <View>
            <Text style={styles.cardLabel}>Card Holder Name</Text>
            <Text style={styles.cardValue}>John Doe</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Expiry Date</Text>
            <Text style={styles.cardValue}>04/28</Text>
          </View>
        </View>
      </View>

      {/* Input Fields */}
      <Text style={styles.inputLabel}>Card Holder Name</Text>
      <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#9f9f9f" />

      <Text style={styles.inputLabel}>Card Number</Text>
      <TextInput style={styles.input} placeholder="0000 0000 0000 00" placeholderTextColor="#9f9f9f" keyboardType="number-pad" />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput style={styles.input} placeholder="04/28" placeholderTextColor="#9f9f9f" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput style={styles.input} placeholder="0000" placeholderTextColor="#9f9f9f" secureTextEntry keyboardType="number-pad" />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}
      onPress={() => router.push("./payNow")}>
        <Text style={styles.saveButtonText}>Save Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00CDF9',
    textAlign: 'center',
    marginBottom: 20,
    marginTop:50
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00CDF9',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#00CDF9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  cardNumber: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 12,
    color: '#6b6b6b',
  },
  cardValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#E6EEFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 14,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    fontSize: 20,
    color: '#00CDF9', // Blue back button
    marginRight: 20,
  },
  saveButton: {
    backgroundColor: '#00CDF9',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCard;
