import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function ProfilePage() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: 'https://bit.ly/dan-abramov' }}
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>Dan Abramov</Text>
          <Text style={styles.roleText}>Doctor</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Active</Text>
          <Ionicons name="chevron-down" size={18} color="black" />
        </View>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('Bio')}  
        >
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.menuText}>My Bio</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>


        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('Messages')}
        >
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text style={styles.menuText}>Messages</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>3</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="briefcase-outline" size={24} color="black" />
          <Text style={styles.menuText}>Verification</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.menuText}>Location</Text>
          <Ionicons name="chevron-forward" size={18} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
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
    backgroundColor: '#00CDF9',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#00A6B9',
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
    color: 'white',
    fontWeight: 'bold',
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
  notificationBadge: {
    backgroundColor: '#00A6B9',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
