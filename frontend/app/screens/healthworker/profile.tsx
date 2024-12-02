import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from "../../api/config"; // Ensure this is the correct base URL

interface DecodedToken {
  profile_id: string;
  user_type: string;
  user_id: string;
  id: string;
}

interface Data {
  first_name: string;
  last_name: string;
  practitioner_type: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [practitionerType, setPractitionerType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('Access token not found. Please log in again.');

      // Decode the token to get user info
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const { profile_id } = decodedToken;

      if (!profile_id) {
        throw new Error('Invalid token. Profile ID is missing.');
      }

      // Build the API endpoint
      const endpoint = `${API_BASE_URL}/medical_practitioners/${profile_id}`;

      // Fetch user profile
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile. Status: ${response.status}`);
      }

      const data: { status: string; data: Data } = await response.json();

      if (data.status === 'success' && data.data) {
        setFirstName(data.data.first_name);
        setLastName(data.data.last_name);
        setPractitionerType(data.data.practitioner_type);
      } else {
        throw new Error('Failed to fetch profile data.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Loading...</Text>
      </ScrollView>
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://bit.ly/dan-abramov' }} // This can be updated to use a profile image if available
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>{firstName.charAt(0).toUpperCase() + firstName.slice(1)} {lastName.charAt(0).toUpperCase() + lastName.slice(1)}</Text>
          <Text style={styles.roleText}>{practitionerType.charAt(17).toUpperCase() + practitionerType.slice(18)}</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Active</Text>
        </View>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('./bio')}
        >
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.menuText}>My Bio</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('./verification')}
        >
          <Ionicons name="briefcase-outline" size={24} color="black" />
          <Text style={styles.menuText}>Verification</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.menuText}>Location</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('../../')}
        >
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.menuText}>Logout</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    paddingTop: 20,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#FFB815',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20, // Added padding at the bottom for better spacing
  },
  header: {
    backgroundColor: 'black',
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
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  roleText: {
    fontSize: 14,
    color: 'white',
  },
  menuContainer: {
    width: '90%',
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 10,
  },
  statusText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
