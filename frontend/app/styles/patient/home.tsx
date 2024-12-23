import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      padding: 20,
      marginTop: 20,
    },
    
    welcomeContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    showMoreButton: {
      marginTop: 20,
      marginBottom: 40,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#00CDF9",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    
    showMoreText: {
      fontSize: 16,
      fontFamily: "Poppins",
      color: "white",
      fontWeight: "bold",
    },
    
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white ",
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
      color: "brown",
      marginTop: 5,
    },
    noAppointmentsText: {
      fontSize: 16,
      fontFamily: "Poppins",
      color: "#888",
      textAlign: "center",
      marginTop: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    welcomeText: {
      fontSize: 18,
      fontFamily: "Poppins",
      color: "#333",
      marginTop: 30,
    },
    nameText: {
      fontSize: 22,
      fontFamily: "Poppins-Bold",
      color: "#00CDF9",
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
      color: "#00CDF9",
      marginBottom: 10,
    },
    consultButton: {
      backgroundColor: "#00CDF9",
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
      justifyContent: "space-evenly",
      alignContent: "space-evenly",
      gap: 14,
      marginBottom: 5,
    },
    
    serviceBox: {
      width: "45%",
      aspectRatio: 1,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 5,
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
      backgroundColor: "#ffffff",
      borderRadius: 5,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    appointmentTime: {
      fontSize: 16,
      fontFamily: "Poppins-Bold",
      color: "#00CDF9",
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
      marginBottom: 10,
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
