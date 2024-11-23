import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Button } from '@rneui/base';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const EditProfile = () => {
  const router = useRouter();
  const [selectedTitle, setSelectedTitle] = useState("Doctor");

  return (
    <View style={styles.container}>
      {/* Header Text */}
      <Text style={styles.header}>EDIT YOUR PROFILE</Text>
      <Text style={styles.subHeader}>(DOCTORS & HEALTH WORKERS)</Text>
      
      {/* Profile and Cover Picture Section */}
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon}>
          <MaterialIcons name="photo-camera" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Update your Profile Picture and Cover Picture</Text>

      {/* Title Selection */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTitle}
          onValueChange={(itemValue) => setSelectedTitle(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Doctor" value="Doctor" />
          <Picker.Item label="Nurse" value="Nurse" />
          <Picker.Item label="Health Worker" value="Health Worker" />
        </Picker>
      </View>

      {/* Input Fields */}
      <TextInput style={styles.input} placeholder="Enter your Specialty" />
      <View style={styles.row}>
        <TextInput style={styles.textArea} placeholder="Enter your Highlights" multiline />
        <TextInput style={styles.textArea} placeholder="Fill in the type of Service/Treatment you Offer" multiline />
      </View>
      <TextInput style={styles.input} placeholder="Enter your Experience" multiline />

      {/* Update Profile Button */}
      <Button title="Update Profile" buttonStyle={styles.button} />

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    padding: 5,
  },
  
  pickerContainer: {
    width: "80%",
    marginBottom: 20,
    marginTop:10,
    textAlign: "center",
    alignSelf: "center",

  },
  label: {
    fontFamily: "Poppins",
    color: "#706d6d",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#00CDF9",
    borderRadius: 25,
    textAlign: "center",
    fontFamily: "Poppins",
    color: "black",
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  textArea: {
    flex: 1,
    height: 100,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    height: 50,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "white",
  },
});

export default EditProfile;
