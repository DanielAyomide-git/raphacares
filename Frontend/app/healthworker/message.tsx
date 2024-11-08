import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { Avatar } from 'react-native-elements';

interface Message {
  id: string;
  name: string;
  message: string;
  unread: boolean;
}

const messages: Message[] = [
  { id: '1', name: 'Aman Gupta', message: 'Hey Piyush!', unread: true },
  { id: '2', name: 'John Doe', message: 'this is the example message', unread: true },
  { id: '3', name: 'Charlie', message: 'this is the example message', unread: true },
  { id: '4', name: 'Smith', message: 'Okay! Done', unread: false },
  { id: '5', name: 'Martin', message: 'See you soon.', unread: false },
  { id: '6', name: 'Gelbero', message: 'I am at work will call you @6pm', unread: false },
];

export default function MessagesScreen() {
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part[0]).join('');
    return initials.toUpperCase();
  };

  const renderMessageItem: ListRenderItem<Message> = ({ item }) => (
    <TouchableOpacity style={styles.messageItem}>
      <Avatar
        rounded
        title={getInitials(item.name)}
        containerStyle={styles.avatar}
        titleStyle={styles.avatarTitle}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      {item.unread && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        style={styles.messageList}
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
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 40,
  },
  messageList: {
    paddingHorizontal: 20,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginBottom: 30,
  },
  avatar: {
    marginRight: 15,
    backgroundColor: '#FFB815', // Background color for initials
  },
  avatarTitle: {
    color: 'black', // Color for the initials text
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: 'black',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
});
