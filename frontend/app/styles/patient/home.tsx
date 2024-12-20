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
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF", // Background color for the loader screen
    },
    welcomeTitle: {
      fontFamily: "Poppins",
      fontSize: 50,
      color: "#0041F9",
      textAlign: "center",
    },
    appointmentReason: {
      fontSize: 14,
      fontFamily: "Poppins",
      color: "#333",
      marginTop: 8,
    },
    appointmentStatus: {
      fontSize: 14,
      fontFamily: "Poppins",
      color: "brown", // You can change this color based on the status (e.g., green for confirmed, red for pending)
      marginTop: 5,
    },
    noAppointmentsText: {
      fontSize: 16,
      fontFamily: "Poppins",
      color: "#888",
      textAlign: "center",
      marginTop: 20,
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
      marginTop:30
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
      alignItems: "center",
    },
    serviceBox: {
      width: "45%",
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
      backgroundColor: "#ffffff", // White background for the card
      borderRadius: 5,          // Rounded corners
      padding: 16,               // Padding inside the card
      marginVertical: 8,         // Space between cards
      marginHorizontal: 4,      // Space on the sides
      shadowColor: "#000",       // Shadow color for elevation
      shadowOffset: { width: 0, height: 2 }, // Shadow position
      shadowOpacity: 0.2,        // Shadow transparency
      shadowRadius: 5,           // Blur radius for shadow
      elevation: 5,              // Elevation for Android shadow
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
      marginBottom: 10
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
    doctorName2: {
      fontSize: 14,
      fontFamily: "Poppins",
      color: "#333",
    },
  });
  

export default styles;
