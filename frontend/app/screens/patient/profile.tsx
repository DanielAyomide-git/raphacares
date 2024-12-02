import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config'; // Assuming this is your API base URL
import {jwtDecode} from 'jwt-decode';

export default function ProfilePage() {
  const [patientName, setPatientName] = useState<string>('Loading...');
  const [patientAvatar, setPatientAvatar] = useState<string>('https://i.pravatar.cc/300?u=po');
  const router = useRouter();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          throw new Error('Token not found');
        }

        // Decode the token to extract profile_id
        const decodedToken = jwtDecode<{ profile_id: string }>(token);
        const { profile_id } = decodedToken;

        const response = await fetch(`${API_BASE_URL}/patients/${profile_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const data = await response.json();
        if (data.status === 'success' && data.data) {
          // Combine first_name and last_name into a full name
          const fullName = `${data.data.first_name} ${data.data.last_name}`;
          setPatientName(fullName);
          setPatientAvatar(data.data.avatar_url || 'https://i.pravatar.cc/300?u=po');
        } else {
          throw new Error('Patient data not found');
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setPatientName('Error loading name');
      }
    };

    fetchPatientData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: patientAvatar }}
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>{patientName}</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('./bio')}  
        >
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.menuText}>My Health Info</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('./resetPassword')}>
          <Ionicons name="briefcase-outline" size={24} color="black" />
          <Text style={styles.menuText}>Change password</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.menuText}>Location</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('../../')}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.menuText}>Logout</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    backgroundColor: 'grey',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 10,
    borderBottomRightRadius: 50,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
  },
  nameText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20,
  },
  menuContainer: {
    width: '90%',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    flex: 1, 
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
});
