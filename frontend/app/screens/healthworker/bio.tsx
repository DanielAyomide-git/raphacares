import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { API_BASE_URL } from '../../api/config'; // Adjust the path as needed
import { useRouter } from 'expo-router';

// Interfaces for the decoded token and bio data
interface DecodedToken {
  profile_id: string;
}

interface BioData {
  first_name: string;
  last_name: string;
  contact: number;
  email: string;
  specialization: string;
}

export default function BioPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const [bioData, setBioData] = useState<BioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('');
  const [practitionerType, setPractitionerType] = useState<string>('');

  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('Access token not found. Please log in again.');

      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const { profile_id } = decodedToken;

      if (!profile_id) throw new Error('Invalid token. Profile ID is missing.');

      const endpoint = `${API_BASE_URL}/medical_practitioners/${profile_id}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bio. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success' && data.data) {
        setFirstName(data.data.first_name);
        setLastName(data.data.last_name);
        setContact(data.data.phone_number);
        setSpecialization(data.data.specialization);
        setPractitionerType(data.data.practitioner_type);
      } else {
        throw new Error('Failed to fetch profile data.');
      }
      if (data.status === 'success' && data.data) {
        setBioData({
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          contact: data.data.contact || 'N/A',
          email: data.data.user.email || 'N/A',
          specialization: data.data.specialization || 'N/A',
        });
      } else {
        throw new Error('Failed to fetch bio data.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Back Button */}
      <View style={styles.headerContainer}>
  {/* Back Button */}
  <TouchableOpacity style={styles.backButton} onPress={() => router.push('./profile')}>
    <Ionicons name="arrow-back" size={24} color="white" />
  </TouchableOpacity>

  {/* Edit Button */}
  <TouchableOpacity style={styles.editButton} onPress={() => router.push('./editProfile')}>
    <Ionicons name="create-outline" size={24} color="white" />
  </TouchableOpacity>
</View>

      

      {/* Header */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://bit.ly/dan-abramov' }} style={styles.profileImage} />
        <Text style={styles.nameText}>{firstName.charAt(0).toUpperCase() + firstName.slice(1)} {lastName.charAt(0).toUpperCase() + lastName.slice(1)}</Text>
          <Text style={styles.roleText}>{practitionerType.charAt(17).toUpperCase() + practitionerType.slice(18)}</Text>
         </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Bio</Text>
       
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoText}>{firstName.charAt(0).toUpperCase() + firstName.slice(1)} {lastName.charAt(0).toUpperCase() + lastName.slice(1)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoText}>{contact}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoText}>{bioData?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="medkit-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Specialization</Text>
          <Text style={styles.infoText}>{bioData?.specialization}</Text>
        </View>
      </View>

      {/* Social Media Links */}
      <View style={styles.socialContainer}>
        <Text style={styles.sectionTitle}>Other Ways People Can Find Me</Text>
        <View style={styles.socialIcons}>
          <Ionicons name="logo-facebook" size={28} color="black"  />
          <Ionicons name="logo-instagram" size={28} color="black"  />
          <Ionicons name="logo-twitter" size={28} color="black"  />
          <Ionicons name="logo-linkedin" size={28} color="black" />
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Background color for the loader screen
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
  headerContainer: {
    flexDirection: 'row', // Aligns items in a row
    alignItems: 'center', // Vertically center items
    justifyContent: 'space-between', // Add space between the buttons
    marginBottom: 15,
  },
  
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  editButton: {
    flexDirection: 'row',
  },
  
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  roleText: {
    fontSize: 14,
    color: 'white',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
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
  socialContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
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
