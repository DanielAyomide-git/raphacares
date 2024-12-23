import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  TextInput,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

interface Message {
  id: string;
  name: string;
  message: string;
  time: string;
  unreadCount: number;
  avatarUrl: string;
}

const messages: Message[] = [
  {
    id: '1',
    name: 'Gloria Borger',
    message: 'Thank you for the answer!!!',
    time: 'Today, 2:00 PM',
    unreadCount: 3,
    avatarUrl: 'https://randomuser.me/api/portraits/women/85.jpg',
  },
  {
    id: '2',
    name: 'Monica Rambeau',
    message: 'Already expected this result...',
    time: 'Today, 2:00 PM',
    unreadCount: 0,
    avatarUrl: 'https://randomuser.me/api/portraits/women/86.jpg',
  },
  {
    id: '3',
    name: 'Clint Barton',
    message: "I'll be waiting",
    time: 'Today, 2:00 PM',
    unreadCount: 1,
    avatarUrl: 'https://randomuser.me/api/portraits/men/57.jpg',
  },
  {
    id: '4',
    name: 'Jeremy Renner',
    message: 'Please check the audio',
    time: 'Today, 2:00 PM',
    unreadCount: 0,
    avatarUrl: 'https://randomuser.me/api/portraits/men/59.jpg',
  },
];

const ChatsScreen: React.FC = () => {
    const router = useRouter();
  
  const renderMessageItem: ListRenderItem<Message> = ({ item }) => (
    <View style={styles.messageContainer}>
      <TouchableOpacity style={styles.messageItem}
      onPress={() => router.push('./chatScreen')}>
        <Avatar
          rounded
          source={{ uri: item.avatarUrl }}
          size={50}
          containerStyle={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {item.message}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.time}>{item.time}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#A0A0A0"
        />
        <Ionicons name="search" size={20} color="#A0A0A0" />
      </View>
  
      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
      />
    </View>
  );
  
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 90,
    marginBottom: 60,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'black',
    fontSize: 14,
  },
  messageList: {
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginBottom: 30,
    shadowColor: '#00cdf9',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10, 
    backgroundColor: '#00cdf9',
    

  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#EFEFEF',
  },
  avatar: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatsScreen;
