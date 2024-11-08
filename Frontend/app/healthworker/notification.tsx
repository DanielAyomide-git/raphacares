import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Notification {
  id: string;
  message: string;
  time: string;
  unreadCount: number;
}

const notifications: Notification[] = [
  { id: '1', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '1m ago', unreadCount: 2 },
  { id: '2', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '1m ago', unreadCount: 2 },
  { id: '3', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '1m ago', unreadCount: 2 },
  { id: '4', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '1m ago', unreadCount: 2 },
  { id: '5', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', time: '1m ago', unreadCount: 2 },
];

export default function NotificationsScreen() {
  const renderNotificationItem: ListRenderItem<Notification> = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.textContainer}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.unreadIndicator}>
        <Text style={styles.unreadText}>{item.unreadCount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        style={styles.notificationList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 20,
  },
  notificationList: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  unreadIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
