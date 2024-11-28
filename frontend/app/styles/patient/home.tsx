import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      padding: 20,
    },
    welcomeContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    welcomeTitle: {
      fontFamily: "Poppins",
      fontSize: 50,
      color: "#0041F9",
      textAlign: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: 18,
      fontFamily: "Poppins",
      color: "#333",
    },
    nameText: {
      fontSize: 22,
      fontFamily: "Poppins-Bold",
      color: "#007BFF",
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    consultationCard: {
      backgroundColor: "#E9F7FF",
      padding: 20,
      borderRadius: 15,
      marginBottom: 20,
      alignItems: "center",
    },
    consultationText: {
      fontSize: 16,
      fontFamily: "Poppins",
      color: "#007BFF",
      marginBottom: 10,
    },
    consultButton: {
      backgroundColor: "#007BFF",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    consultButtonText: {
      fontSize: 14,
      fontFamily: "Poppins-Bold",
      color: "white",
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: "Poppins-Bold",
      color: "#333",
      marginBottom: 10,
    },
    servicesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    serviceBox: {
      width: "40%",
      aspectRatio: 1,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    serviceText: {
      fontSize: 14,
      fontFamily: "Poppins-Bold",
      color: "white",
      marginTop: 8,
      textAlign: "center",
    },
    appointmentCard: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 15,
      elevation: 5,
    },
    appointmentTime: {
      fontSize: 16,
      fontFamily: "Poppins-Bold",
      color: "#007BFF",
      marginBottom: 5,
    },
    appointmentDate: {
      fontSize: 14,
      fontFamily: "Poppins",
      color: "#555",
      marginBottom: 10,
    },
    doctorInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    doctorImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    doctorName: {
      fontSize: 14,
      fontFamily: "Poppins-Bold",
      color: "#333",
    },
  });
  

export default styles;
