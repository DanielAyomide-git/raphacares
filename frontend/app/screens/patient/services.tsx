import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_BASE_URL } from '../../api/config'; // Adjust the path as needed


interface Practitioner {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
  practitioner_type: string;
  specialization: string;
}

const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Doctors");
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const router = useRouter();

  const categories: string[] = ["Doctors", "Nurses", "Others"];

  useEffect(() => {
    const fetchPractitioners = async () => {
      try {

        const endpoint = `${API_BASE_URL}/medical_practitioners/`;
       
             const response = await fetch(endpoint,
        );
        const data = await response.json();
        if (data.status === "success") {
          setPractitioners(data.data);
        }
      } catch (error) {
        console.error("Error fetching practitioners:", error);
      }
    };

    fetchPractitioners();
  }, []);

  const handlePractitionerPress = async (practitionerId: string) => {
    try {
      await AsyncStorage.setItem("selectedPractitionerId", practitionerId);
      console.log(practitionerId);
      router.push("./healthWorkerInfo");
    } catch (error) {
      console.error("Error saving practitioner ID:", error);
    }
  };

  const filteredPractitioners = practitioners.filter((practitioner) => {
    if (selectedCategory === "Doctors") {
      return practitioner.practitioner_type === "doctor";
    }
    if (selectedCategory === "Others") {
      return practitioner.practitioner_type === "community_health";
    }
    if (selectedCategory === "Nurses") {
      return practitioner.practitioner_type === "nurse";
    }
    return false;
  });

  const renderPractitioner = ({ item }: { item: Practitioner }) => (
    <View style={styles.practitionerCard}>
      <View style={styles.practitionerInfo}>
        <View style={styles.avatar}>
          {item.profile_picture_url ? (
            <Image
              source={{ uri: item.profile_picture_url }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={50} color="#E0E0E0" />
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => handlePractitionerPress(item.id)}>
            <Text style={styles.practitionerName}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.practitionerSpecialization}>
              {item.practitioner_type
                ? item.practitioner_type.charAt(0).toUpperCase() +
                  item.practitioner_type.slice(1)
                : "N/A"}
            </Text>
            <Text style={styles.practitionerSpecialization}>
              Specialization: {item.specialization || "N/A"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("./app")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryButton}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Practitioner List */}
        <View style={styles.practitionerList}>
            {filteredPractitioners.length > 0 ? (
              filteredPractitioners.map((practitioner) => (
                <View key={practitioner.id}>
                  {renderPractitioner({ item: practitioner })}
                </View>
              ))
            ) : (
              <Text style={styles.noPractitionersText}>
                Not available. Please check back later.
              </Text>
            )}
          </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
  },
  categoryButton: {
    marginHorizontal: 10,
  },
  categoryText: {
    fontSize: 14,
    color: "#888",
  },
  activeCategoryText: {
    color: "#00CDF9",
    fontWeight: "bold",
    fontSize: 20,
  },
  practitionerList: {
    marginTop: 10,
  },
  practitionerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
  },
  practitionerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  practitionerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  practitionerSpecialization: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
  noPractitionersText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Services;
