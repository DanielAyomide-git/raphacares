import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BioPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: 'https://bit.ly/dan-abramov' }}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>Morgan James</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.roleText}>Doctor</Text>
          </View>
          <Ionicons name="pencil-outline" size={20} color="white" style={styles.editIcon} />
        </View>
     

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>PROFILE</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Full name</Text>
          <Text style={styles.infoText}>FirstName LastName</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoText}>+24500000000</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoText}>mjdesigner@gmail.com</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="medkit-outline" size={24} color="black" />
          <Text style={styles.infoLabel}>Specialization</Text>
          <Text style={styles.infoText}>Specialization</Text>
        </View>
      </View>

      {/* Social Media Links */}
      <View style={styles.socialContainer}>
        <Text style={styles.sectionTitle}>Other Ways People Can Find Me</Text>
        <View style={styles.socialIcons}>
          <Ionicons name="logo-facebook" size={28} color="black" style={styles.socialIcon} />
          <Ionicons name="logo-instagram" size={28} color="black" style={styles.socialIcon} />
          <Ionicons name="logo-twitter" size={28} color="black" style={styles.socialIcon} />
          <Ionicons name="logo-linkedin" size={28} color="black" style={styles.socialIcon} />
        </View>
      </View>

      {/* Help and Feedback */}
      <TouchableOpacity style={styles.helpContainer}>
        <Ionicons name="help-circle-outline" size={24} color="black" />
        <Text style={styles.helpText}>Help and Feedback</Text>
        <Ionicons name="chevron-forward" size={18} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
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
  socialContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    color: "white",
  },
  socialIcon: {
    marginHorizontal: 5,
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
