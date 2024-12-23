import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'; // Ensure correct import
import { API_BASE_URL } from '../../api/config'; // Adjust the path as needed
import { useRouter } from 'expo-router';

// Interfaces for the decoded token and bio data
interface DecodedToken {
  profile_id: string;
}

interface BioData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  city: string;
  profile_picture_url: string;
  date_of_birth: string;
  country: string;
  gender: string;
}

export default function BioPage() {
  const router = useRouter();
  const [bioData, setBioData] = useState<BioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('Access token not found. Please log in again.');

      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const { profile_id } = decodedToken;
      setProfileId(profile_id);

      if (!profile_id) throw new Error('Invalid token. Profile ID is missing.');

      const endpoint = `${API_BASE_URL}/patients/${profile_id}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bio. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success' && data.data) {
        setBioData({
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          phone_number: data.data.phone_number || 'N/A',
          email: data.data.user.email || 'N/A',
          city: data.data.city || 'N/A',
          profile_picture_url: data.data.profile_picture_url || '',
          date_of_birth: data.data.date_of_birth || 'N/A',
          gender: data.data.gender || 'N/A',
          country: data.data.country || 'N/A',
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

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to your media library.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.canceled) {
        const selectedImageUri = pickerResult.assets[0].uri;
        setImageUri(selectedImageUri);
        await uploadImage(selectedImageUri);

        // Navigate to './app' after successful image upload
        router.push('./app');
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      if (!profileId) {
        Alert.alert('Error', 'Profile ID is missing.');
        return;
      }

      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'Access token not found. Please log in again.');
        return;
      }

      // Fetch the binary data of the file
    const fileResponse = await fetch(uri);
    const fileBlob = await fileResponse.blob();
    
      const formData = new FormData();
      formData.append('profile_id', profileId);
      formData.append('resource_type', 'profile_picture');
      formData.append('file', fileBlob, `profile_${profileId}.jpg`); 


      const endpoint = `${API_BASE_URL}/patients/${profileId}/upload_file`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        Alert.alert('Success', 'Profile picture updated successfully.');
        fetchBioData();
      } else {
        throw new Error(data.message || 'Image upload failed.');
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      Alert.alert('Error', err.message || 'Something went wrong while uploading the image.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00CDF9" />
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
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push('./editProfile')}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
        <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : bioData?.profile_picture_url
                  ? { uri: bioData.profile_picture_url }
                  : require("../../assets/dp.png") 
              }
              style={styles.profileImage}
            />

          <TouchableOpacity style={styles.editIcon} onPress={handleImagePicker}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameText}>
          {bioData?.first_name} {bioData?.last_name}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Phone number</Text>
          <Text style={styles.infoText}>{bioData?.phone_number}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoText}>{bioData?.email}</Text>
        </View>
        <View style={styles.infoRow}>
  <Ionicons name="airplane-outline" size={24} color="black" />
  <Text style={styles.infoLabel}>City</Text>
  <Text style={styles.infoText}>
    {bioData?.city ? bioData.city.charAt(0).toUpperCase() + bioData.city.slice(1) : ""}
  </Text>
</View>

<View style={styles.infoRow}>
  <Ionicons name="planet-outline" size={24} color="black" />
  <Text style={styles.infoLabel}>Gender</Text>
  <Text style={styles.infoText}>
    {bioData?.gender ? bioData.gender.charAt(0).toUpperCase() + bioData.gender.slice(1) : ""}
  </Text>
</View>


        <View style={styles.infoRow}>
        <Ionicons name="person-add-outline" size={24} color="black" />
        <Text style={styles.infoLabel}>DOB</Text>
        <Text style={styles.infoText}>
          {bioData?.date_of_birth?.split('T')[0]}
        </Text>
      </View>

        


      </View>

      

      <TouchableOpacity style={styles.helpContainer}>
        <Ionicons name="help-circle-outline" size={24} color="black" />
        <Text style={styles.helpText}>Help and Feedback</Text>
        <Ionicons name="chevron-forward" size={18} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} >
        <Ionicons name="book-outline" size={24} color="black" />
        <Text style={styles.menuText}>Medical Record</Text>
        <Ionicons name="chevron-forward" size={18} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('../../')}>
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Text style={styles.menuText}>Logout</Text>
        <Ionicons name="chevron-forward" size={18} color="black" />
      </TouchableOpacity>
     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 20,
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ddd',
    // Shadow for profile image wrapper
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00CDF9',
    marginTop: 10,
  },
  roleText: {
    fontSize: 14,
    color: '#555',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    // Shadow for details container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#777',
  },
  editButton: {
    flexDirection: 'row',
    marginTop: 30,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  socialContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    // Shadow for social container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    // Shadow for help container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  helpText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
});
