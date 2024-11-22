import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AdminPanel = () => {
  const handleLogout = () => {
    // Logic for logging out
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <Button title="Logout" onPress={handleLogout} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Management</Text>
        {/* Add user management components here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {/* Add settings components here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AdminPanel;
