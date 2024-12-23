import React, { useState } from 'react';
import { useRouter } from 'expo-router'; // Import the router hook

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

interface Appointment {
  id: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  rating: number;
  imageUrl: string;
  category:  'Pending' | 'Cancelled'| 'Confirmed'|'Completed' ;
}

const appointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Olivia Turner, M.D.',
    speciality: 'Dermato-Endocrinology',
    date: 'Sunday, 12 June',
    time: '9:30 AM - 10:00 AM',
    rating: 5,
    imageUrl: 'https://via.placeholder.com/50',
    category: 'Completed',
  },
  {
    id: '2',
    doctorName: 'Dr. Alexander Bennett, Ph.D.',
    speciality: 'Dermato-Genetics',
    date: 'Friday, 20 June',
    time: '2:30 PM - 3:00 PM',
    rating: 4,
    imageUrl: 'https://via.placeholder.com/50',
    category: 'Pending',
  },
  {
    id: '3',
    doctorName: 'Dr. Sophia Martinez, Ph.D.',
    speciality: 'Cosmetic Bioengineering',
    date: 'Tuesday, 15 June',
    time: '9:30 AM - 10:00 AM',
    rating: 5,
    imageUrl: 'https://via.placeholder.com/50',
    category: 'Cancelled',
  },
  {
    id: '3',
    doctorName: 'Dr. Sophia Martinez, Ph.D.',
    speciality: 'Cosmetic Bioengineering',
    date: 'Tuesday, 15 June',
    time: '9:30 AM - 10:00 AM',
    rating: 5,
    imageUrl: 'https://via.placeholder.com/50',
    category: 'Confirmed',
  },
];

const AppointmentsScreen: React.FC = () => {
  const router = useRouter(); // Initialize the router
  const [selectedCategory, setSelectedCategory] = useState<'Pending' | 'Cancelled'| 'Confirmed'|'Completed'>('Completed');

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.category === selectedCategory
  );

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    return (
      <View style={styles.appointmentCard}>
        <View style={styles.topRow}>
          <Image           source={{ uri: 'https://randomuser.me/api/portraits/women/72.jpg' }} 
           style={styles.doctorImage} />
          <Text style={styles.doctorName}>{item.doctorName}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.speciality}>{item.speciality}</Text>
          {selectedCategory === 'Pending' && (
            <>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </>
          )}
          {selectedCategory === 'Completed' && (
            <Text style={styles.rating}>
              ⭐ {item.rating} <Text style={styles.heart}>❤</Text>
            </Text>
          )}
        </View>
        <View style={styles.actionButtons}>
  {selectedCategory === 'Pending' ? (
    <>
      <TouchableOpacity style={[styles.actionButton, styles.detailsButton]}>
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </>
  ) : selectedCategory === 'Completed' ? (
    <>
     <TouchableOpacity style={[styles.actionButton, styles.addReviewButton]} onPress={() => router.push('./addReview')}>
        <Text style={styles.buttonText}>Add Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.rebookButton]} onPress={() => router.push('./services')}>
        <Text style={styles.buttonText}>Re-Book</Text>
      </TouchableOpacity>
     
    </>
  ) : selectedCategory === 'Confirmed' ? (
    <>
      <TouchableOpacity style={[styles.actionButton, styles.detailsButton]}>
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, styles.payButton]}>
        <Text style={styles.buttonText}>Pay</Text>
      </TouchableOpacity>
    </>
  ) : (
    selectedCategory === 'Cancelled' && (
      <TouchableOpacity style={[styles.actionButton, styles.addReviewButton]} onPress={() => router.push('./addReview')}>
        <Text style={styles.buttonText}>Add Review</Text>
      </TouchableOpacity>
    )
  )}
</View>

      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Appointment</Text>
      </View>

      <View style={styles.tabs}>
        {['Pending' , 'Confirmed','Completed', 'Cancelled'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category as 'Completed' | 'Pending' | 'Cancelled' | 'Confirmed')}
            style={[
              styles.tab,
              selectedCategory === category && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === category && styles.activeTabText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a73e8',
    textAlign: 'center',
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    marginBottom: 10,
  },
  activeTab: {
    backgroundColor: '#1a73e8',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    paddingLeft: 62, // Aligns with the space occupied by the image
  },
  speciality: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#1a73e8',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#1a73e8',
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  heart: {
    color: '#f44336',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16, // Standardized padding for all buttons
    marginRight: 10,
  },
  detailsButton: {
    backgroundColor: '#1a73e8',
    marginLeft:60
  },
  addReviewButton: {
    backgroundColor: '#1a73e8',
    marginLeft:60,
  },
  rebookButton: {
    backgroundColor: '#1a73e8',
  },
  payButton: {
    backgroundColor: '#4caf50',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});



export default AppointmentsScreen;

