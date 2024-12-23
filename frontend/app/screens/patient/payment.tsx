import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

// Define types for the payment options
type PaymentOption = {
  id: string;
  label: string;
  icon: string;
};

const PaymentScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter(); // Expo Router for navigation

  // Payment options data
  const paymentOptions: PaymentOption[] = [
    {
      id: 'creditCard',
      label: 'Add New Card',
      icon: 'https://img.icons8.com/?size=100&id=e2vmJUx1xbAv&format=png&color=000000',
    },
    {
      id: 'applePay',
      label: 'Apple Pay',
      icon: 'https://img.icons8.com/?size=100&id=znhErJWkRjHW&format=png&color=000000',
    },
    {
      id: 'paypal',
      label: 'Paypal',
      icon: 'https://img.icons8.com/ios/50/000000/paypal.png',
    },
    {
      id: 'googlePlay',
      label: 'Google Play',
      icon: 'https://img.icons8.com/ios/50/000000/google-logo.png',
    },
  ];

  // Function to handle selecting a payment option
  const handleOptionSelect = (id: string) => {
    setSelectedOption(id);
    if (id === 'creditCard') {
      router.push('./card'); // Assuming 'card.tsx' is in the `pages` folder
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("./app")}
          style={styles.backButton}
          >
        <Ionicons name="arrow-back" size={24} color="#00CDF9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
      </View>

      {/* Credit & Debit Card Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Method</Text>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => handleOptionSelect('creditCard')}
        >
          <View style={styles.optionContent}>
            <Image
              source={{ uri: paymentOptions[0].icon }}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{paymentOptions[0].label}</Text>
          </View>
          <View
            style={
              selectedOption === 'creditCard'
                ? styles.radioDotFilled
                : styles.radioOutline
            }
          />
        </TouchableOpacity>
      </View>

      {/* More Payment Options Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Payment Options</Text>
        {paymentOptions.slice(1).map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.paymentOption}
            onPress={() => handleOptionSelect(option.id)}
          >
            <View style={styles.optionContent}>
              <Image
                source={{ uri: option.icon }}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>{option.label}</Text>
            </View>
            <View
              style={
                selectedOption === option.id
                  ? styles.radioDotFilled
                  : styles.radioOutline
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    paddingHorizontal: 20,
    paddingTop: 40, // Adjust top padding as needed
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  backButton: {
    fontSize: 20,
    color: '#00CDF9', // Blue back button
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00CDF9', // Blue header title
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00CDF9', // Light blue background for options
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain', // Important for consistent icon sizing
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  radioDotFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
});

export default PaymentScreen;
