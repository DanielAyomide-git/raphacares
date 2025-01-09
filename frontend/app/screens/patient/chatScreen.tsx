import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const ChatScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/85.jpg' }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Gloria Borger</Text>
            <Text style={styles.profileStatus}>Online</Text>
          </View>
        </View>
        {/* Call and Video Icons */}
        <View style={styles.iconContainer}>


          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={{
                uri: 'https://img.icons8.com/?size=100&id=12629&format=png&color=000000',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatMessages}>
        {/* Received Message */}
        <View style={styles.chatBubbleReceived}>
          <Text style={styles.chatText}>Use the stick on other side fandit</Text>
          <Text style={styles.chatTime}>08:20</Text>
        </View>

        {/* Sent Message */}
        <View style={styles.chatBubbleSent}>
          <Text style={styles.chatText}>Thanks Doctor</Text>
          <Text style={styles.chatTime}>08:29</Text>
        </View>

        {/* Sent Message */}
        <View style={styles.chatBubbleSent}>
          <Text style={styles.chatText}>
            Morning! {'\n'}how the results, did it work well
          </Text>
          <Text style={styles.chatTime}>09:47</Text>
        </View>

        {/* Received Message */}
        <View style={styles.chatBubbleReceived}>
          <Text style={styles.chatText}>
            Morning doctor, the problem is solved.
          </Text>
          <Text style={styles.chatTime}>09:50</Text>
        </View>

        {/* Sent Message */}
        <View style={styles.chatBubbleSent}>
          <Text style={styles.chatText}>you’re welcome</Text>
          <Text style={styles.chatTime}>09:51</Text>
        </View>

        {/* Received Message */}
        <View style={styles.chatBubbleReceived}>
          <Text style={styles.chatText}>Use the stick on other side fandit</Text>
          <Text style={styles.chatTime}>08:20</Text>
        </View>

        {/* Sent Message */}
        <View style={styles.chatBubbleSent}>
          <Text style={styles.chatText}>Thanks Doctor</Text>
          <Text style={styles.chatTime}>08:29</Text>
        </View>

        {/* Sent Message */}
        <View style={styles.chatBubbleSent}>
          <Text style={styles.chatText}>
            Morning! {'\n'}how the results, did it work well
          </Text>
          <Text style={styles.chatTime}>09:47</Text>
        </View>

        {/* Received Message */}
        <View style={styles.chatBubbleReceived}>
          <Text style={styles.chatText}>
            Morning doctor, the problem is solved.
          </Text>
          <Text style={styles.chatTime}>09:50</Text>
        </View>

        {/* Sent Message */}
        <View style={styles.chatBubbleSent}>
          <Text style={styles.chatText}>you’re welcome</Text>
          <Text style={styles.chatTime}>09:51</Text>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          placeholderTextColor="#888"
          keyboardType="default"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendIcon}>✈️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.voiceButton}>
          <Text style={styles.voiceIcon}>🎤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00cdf9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 50,
    marginBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileDetails: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  profileStatus: {
    fontSize: 14,
    color: 'white',
  },
  backButton: {
    fontSize: 18,
    marginRight: 10,
    color: 'black',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#00cdf9',
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  chatBubbleReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffd77a',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '75%',
  },
  chatBubbleSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#94ebff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '75%',
  },
  chatText: {
    fontSize: 14,
    color: '#000',
  },
  chatTime: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00cdf9',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  sendIcon: {
    fontSize: 18,
    color: 'white',
  },
  voiceButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00cdf9',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  voiceIcon: {
    fontSize: 18,
    color: 'white',
  },
});

export default ChatScreen;
