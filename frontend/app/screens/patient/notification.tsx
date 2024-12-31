import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';

interface Notification {
  id: string;
  name: string;
  message: string;
  time: string;
  type: 'Consultations' | 'Appointments' | 'Prescriptions';
  profileImage: string;
  postImage?: string;
  onPress?: () => void;
}

const notifications: Notification[] = [
  {
    id: '1',
    name: 'Stephan Louis',
    message: 'Rejected your appointment.',
    time: '10:04 AM',
    type: 'Appointments',
    profileImage: 'https://randomuser.me/api/portraits/men/78.jpg',
    onPress: () => console.log('Appointment 1 clicked'),
  },
  {
    id: '2',
    name: 'Hannah Flores',
    message: 'Approved your appointment.',
    time: '10:00 AM',
    type: 'Appointments',
    profileImage: 'https://randomuser.me/api/portraits/men/80.jpg',
    onPress: () => console.log('Appointment 2 clicked'),
  },
  {
    id: '3',
    name: 'Olivia Johnson',
    message: 'Consultation scheduled for January 10, 2024 at 10:00 AM.',
    time: '9:00 AM',
    type: 'Consultations',
    profileImage: 'https://randomuser.me/api/portraits/women/85.jpg',
    onPress: () => console.log('Consultation 3 clicked'),
  },
  {
    id: '4',
    name: 'Emily Clark',
    message: 'Prescribed Amoxicillin 500mg. Take 1 capsule three times a day for 7 days.',
    time: '8:15 AM',
    type: 'Prescriptions',
    profileImage: 'https://randomuser.me/api/portraits/women/85.jpg',
    onPress: () => console.log('Prescription 4 clicked'),
  },
  {
    id: '5',
    name: 'Tim Marshall',
    message: 'Approved your appointment.',
    time: '8:02 PM',
    type: 'Appointments',
    profileImage: 'https://randomuser.me/api/portraits/men/78.jpg',
    onPress: () => console.log('Appointment 5 clicked'),
  },
];

export default function NotificationsScreen() {
  const [selectedTab, setSelectedTab] = useState<'Appointments' | 'Consultations' | 'Prescriptions'>('Appointments');
  const [isModalVisible, setModalVisible] = useState(false); // state to control modal visibility
  const [modalContent, setModalContent] = useState<string>(''); // state to manage modal content
  const router = useRouter();

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedTab === 'Consultations') return notification.type === 'Consultations';
    if (selectedTab === 'Prescriptions') return notification.type === 'Prescriptions';
    return notification.type === 'Appointments'; // only show appointments in the Appointments tab
  });

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, styles.shadow]}
    >
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {item.type === 'Appointments' && item.message.includes('Approved') ? (
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText} onPress={() => router.push("./payment")}>Pay</Text>
        </TouchableOpacity>
      ) : (
        item.postImage && <Image source={{ uri: item.postImage }} style={styles.postImage} />
      )}

      {item.type === 'Consultations' || item.type === 'Prescriptions' ? (
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText} 
            onPress={() => {
              if (item.type === 'Consultations') {
                setModalContent('Consultation scheduled for January 10, 2024, at 10:00 AM. Please be on time.');
              } else if (item.type === 'Prescriptions') {
                setModalContent('Prescription: Amoxicillin 500mg, Take 1 capsule three times a day for 7 days. Goodluck and safe recovery');
              }
              setModalVisible(true); // Open modal
            }}
          >
            View
          </Text>
        </TouchableOpacity>
      ) : (
        item.postImage && <Image source={{ uri: item.postImage }} style={styles.postImage} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Appointments' && styles.activeTab]}
          onPress={() => setSelectedTab('Appointments')}
        >
          <Text style={[styles.tabText, selectedTab === 'Appointments' && styles.activeTabText]}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Consultations' && styles.activeTab]}
          onPress={() => setSelectedTab('Consultations')}
        >
          <Text style={[styles.tabText, selectedTab === 'Consultations' && styles.activeTabText]}>Consultations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Prescriptions' && styles.activeTab]}
          onPress={() => setSelectedTab('Prescriptions')}
        >
          <Text style={[styles.tabText, selectedTab === 'Prescriptions' && styles.activeTabText]}>Prescriptions</Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        style={styles.notificationList}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal for Viewing Consultation/Prescription Details */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalContent}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginTop: 30,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00CDF9',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#00CDF9',
    fontWeight: 'bold',
  },
  notificationList: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00CDF9',
    marginVertical: 6,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  shadow: {
    shadowColor: '#00CDF9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  message: {
    fontSize: 13,
    color: '#444',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  followButton: {
    backgroundColor: '#00CDF9',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  followButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#00CDF9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
