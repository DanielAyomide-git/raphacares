import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config'; // Update this with your actual API configuration
import {jwtDecode} from 'jwt-decode';

export default function BioPage() {
  const [patientData, setPatientData] = useState<any>({
    first_name: 'Loading...',
    last_name: '',
    country: 'Loading...',
    state: 'Loading...',
    contact: 'Loading...',
    email: 'Loading...',
    avatar_url: 'https://i.pravatar.cc/300?u=po',
  });
  const navigation = useNavigation();

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
          setPatientData({
            first_name: data.data.first_name,
            last_name: data.data.last_name,
            country: data.data.country || 'Not provided',
            state: data.data.state || 'Not provided',
            contact: data.data.phone_number || 'Not provided',
            email: data.data.user.email || 'Not provided',
            avatar_url: data.data.avatar_url || 'https://i.pravatar.cc/300?u=po',
          });
        } else {
          throw new Error('Patient data not found');
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setPatientData({ ...patientData, first_name: 'Error', last_name: 'Loading data' });
      }
    };

    fetchPatientData();
  }, []);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} 
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: patientData.avatar_url }}
          style={styles.profileImage}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>
            {patientData.first_name} {patientData.last_name}
          </Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.roleText}>Patient</Text>
        </View>
        <Ionicons name="pencil-outline" size={20} color="black" style={styles.editIcon} />
      </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>PROFILE</Text>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoText}>
          {patientData.firstName.charAt(0).toUpperCase() + patientData.firstName.slice(1)} {patientData.lastName.charAt(0).toUpperCase() + patientData.lastName.slice(1)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="planet-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Country</Text>
          <Text style={styles.infoText}>{patientData.country}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="airplane-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>State</Text>
          <Text style={styles.infoText}>{patientData.state}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoText}>{patientData.contact}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoText}>{patientData.email}</Text>
        </View>
      </View>

      {/* Help and Feedback */}
      <TouchableOpacity style={styles.helpContainer}>
        <Ionicons name="help-circle-outline" size={24} color="black" />
        <Text style={styles.helpText}>Help and Feedback</Text>
        <Ionicons name="chevron-forward" size={18} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  contentContainer: {
    paddingBottom: 20,
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  roleText: {
    fontSize: 14,
    color: 'white',
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  backButton: {
    marginBottom: 15,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: 'black',
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: 'grey',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  helpText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
});
