import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      paddingTop: 40,
      paddingHorizontal: 20,
    },
    welcomeContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "white",
      alignItems: "center",
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF", // Background color for the loader screen
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFEEEE", // Light red background for error
      paddingHorizontal: 20, // Padding for error text
    },
    errorText: {
      color: "#D32F2F", // Red color for error text
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Poppins-Bold", // Ensure this matches your loaded fonts
    },
    welcomeText1: {
      fontFamily: "Poppins",
      fontSize: 50,
      color: "#FFB815",
      textAlign: "center",
    },
    welcomeText: {
      fontFamily: "Poppins",
      fontSize: 24,
      color: "#FFB815",
      textAlign: "center",
    },
    dashboardContainer: {
      flex: 1,
      backgroundColor: "white",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    doctorText: {
      fontFamily: "Poppins-SemiBold",
      color: "#FFB815",
      marginLeft: 2,
      marginBottom: 20,
    },
    settingsIcon: {
      marginLeft: "auto",
    },
    searchContainer: {
      flexDirection: "row",
      backgroundColor: "#E0E0E0",
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 10,
      alignItems: "center",
      marginBottom: 20,
    },
    searchInput: {
      flex: 1,
      fontFamily: "Poppins",
      fontSize: 14,
    },
    searchIcon: {
      marginLeft: 10,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontFamily: "Poppins-SemiBold",
      color: "#FFB815",
      fontSize: 16,
      marginBottom: 10,
    },
    appointmentBox: {
      height: 100,
      backgroundColor: "#F2F2F2",
      borderRadius: 15,
    },
    commentsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    commentItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    commentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#A0A0A0",
      marginRight: 10,
    },
    commentTextContainer: {
      flex: 1,
    },
    commentName: {
      fontFamily: "Poppins-Bold",
      fontSize: 14,
    },
    commentDate: {
      fontFamily: "Poppins",
      fontSize: 10,
      color: "#A0A0A0",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: 2,
      marginRight:10,
      marginBottom:18,
    },
  });
  