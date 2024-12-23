import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Modal from 'react-native-modal';

const PayNow = () => {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handleConfirmPayment = () => {
    setPaymentStatus('Success');
    hideModal();

    // Show alert with payment success status and navigate to './app' after 'OK' is pressed
    Alert.alert('Payment Successful', 'Your payment has been successfully processed.', [
      {
        text: 'OK',
        onPress: () => router.push('./app'), // Navigate to './app' when 'OK' is pressed
      },
    ]);
  };

  const handleCancelPayment = () => {
    setPaymentStatus('Cancelled');
    hideModal();

    // Show alert with payment cancelled status
    Alert.alert('Payment Cancelled', 'Your payment has been cancelled.', [
      {
        text: 'OK',
        onPress: () => console.log('Payment Cancelled'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Amount Section */}
      <View style={styles.amountSection}>
        <Text style={styles.amount}>$ 100.00</Text>
      </View>

      {/* Doctor Details */}
      <View style={styles.doctorDetails}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/72.jpg' }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>Dr. Olivia Turner, M.D.</Text>
          <Text style={styles.specialty}>Dermato-Endocrinology</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date / Hour</Text>
          <Text style={styles.detailValue}>Month 24, Year / 10:00 AM</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>30 Minutes</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Booking for</Text>
          <Text style={styles.detailValue}>Another Person</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>$100.00</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>30 Minutes</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>$100</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          {/* Added TouchableOpacity for Card Change */}
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.changeText}>Card Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Now Button */}
      <TouchableOpacity style={styles.payButton} onPress={showModal}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>

      {/* Modal for confirmation */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Are you sure you want to pay?</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={handleConfirmPayment} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelPayment} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
  },
  amountSection: {
    backgroundColor: '#00CDF9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 10,
  },
  amount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  doctorDetails: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  doctorInfo: {
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
  },
  detailsSection: {
    padding: 20,
    marginTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  changeText: {
    fontSize: 14,
    color: '#00CDF9',
  },
  payButton: {
    backgroundColor: '#00CDF9',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    margin: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#00CDF9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paymentStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#00CDF9',
  },
});

export default PayNow;
