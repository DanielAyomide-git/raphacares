import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const AddReview = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0); // State to manage star rating

  const handleStarPress = (index: number) => {
    setRating(index + 1); // Update rating when a star is clicked
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Review</Text>
        <View style={{ width: 20 }} /> {/* Placeholder for header alignment */}
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      {/* New Image */}
      <Image
        source={{
          uri: 'https://randomuser.me/api/portraits/women/72.jpg',
        }}
        style={styles.reviewImage}
      />

      {/* Doctor Info */}
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>Dr. Olivia Turner, M.D.</Text>
        <Text style={styles.speciality}>Dermato-Endocrinology</Text>
        {/* Rating */}
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
              <Text
                style={[
                  styles.star,
                  { color: index < rating ? '#FFC107' : '#E0E0E0' }, // Highlight selected stars
                ]}
              >
                {index < rating ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Comment Box */}
      <TextInput
        style={styles.commentBox}
        placeholder="Enter Your Comment Here..."
        multiline
      />

      {/* Add Review Button */}
      <TouchableOpacity style={styles.addReviewButton}>
        <Text style={styles.addReviewButtonText}>Add Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 18,
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  reviewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  doctorInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  speciality: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 30,
    marginHorizontal: 4,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlignVertical: 'top',
    height: 120,
  },
  addReviewButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addReviewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddReview;
