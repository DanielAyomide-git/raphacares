import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/300?u=po' }}
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>Jane Doe</Text>
          <Text>Patient</Text>

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

       

        <TouchableOpacity style={styles.menuItem}
         onPress={() => router.push('./verification')} 
         >
          <Ionicons name="briefcase-outline" size={24} color="black" />
          <Text style={styles.menuText}>Change password</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.menuText}>Location</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}
         onPress={() => router.push('./index')} 
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
  container: {
    flexGrow: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 10,
    borderBottomRightRadius: 50,
  },
  menuIcon: {
    position: 'absolute',
    top: 10,
    left: 20,
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
    marginBottom: 5
  },
  roleText: {
    fontSize: 14,
    color: 'black',
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
    backgroundColor: 'black',
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
    color: 'white',
    textAlign: "center"
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    flex: 1, 
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
  notificationBadge: {
    backgroundColor: '#00A6B9',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
