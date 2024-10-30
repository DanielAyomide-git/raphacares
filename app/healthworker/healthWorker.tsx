import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function OnboardingPage() {
  const [showLogo, setShowLogo] = useState(true); // State to show the logo
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(500)).current; // Initial position off-screen (500px to the right)

  // Hide the logo after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 0); // 3 seconds delay

    return () => clearTimeout(timer); // Clear timeout if the component is unmounted
  }, []);

  // Trigger the sliding animation after the logo is hidden
  useEffect(() => {
    if (!showLogo) {
      Animated.timing(slideAnim, {
        toValue: 0, // Move to the final position (0)
        duration: 1000, // Slide duration in milliseconds
        useNativeDriver: true, // Use native driver for smoother performance
      }).start();
    }
  }, [showLogo]);

  // Logo display
  if (showLogo) {
    return (
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Main onboarding page with sliding animation 
  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.title}>Login </Text>

      <View style={styles.cardContainer}>
        {/* Client Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/healthworker/loginHealth')}
          >
            <MaterialIcons name="person" size={40} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Doctor</Text>
          </TouchableOpacity>
        </View>

        {/* Doctor Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/healthworker/loginHealth')}
          >
            <MaterialIcons name="local-hospital" size={40} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Nurse</Text>
          </TouchableOpacity>
        </View>

        {/* Admin Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/healthworker/loginHealth')}
          >
            <MaterialIcons name="admin-panel-settings" size={40} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Community</Text>
          </TouchableOpacity>
        </View>

        {/* Register Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/healthworker/registerHealth')}
          >
            <MaterialIcons name="how-to-reg" size={40} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 50,
  },
  logo: {
    width: 200,
    height: 200,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#9F9F9F',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'raleway',
    marginBottom: 50,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#00CDF9',
    paddingVertical: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'regular',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',


  },
  icon: {
    marginBottom: 10,
  },
});
