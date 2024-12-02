import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
  },
  forgotPassword: {
    color: "#5c5a5a",
    textDecorationLine: "underline",
    fontSize: 14,
    fontFamily: "poppins",
  },
  icon: {
    width: 40,
    height: 40,
  },
  pickerContainer: {
    width: "80%",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerLabel: {
    fontFamily: "Poppins",
    color: "#706d6d",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  scrollViewContainer: {
    flexGrow: 1, // Ensures the content grows to take up available space
    justifyContent: "center", // Vertically centers the content
    alignItems: "center", // Horizontally centers the content
    paddingHorizontal: 20, // Adds padding on the left and right for better spacing
    paddingBottom: 20, // Adds padding at the bottom to ensure buttons are not cut off
  },
  
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    textAlign: "center",
    fontFamily: "Poppins",
    color: "black",
  },
  errorText: {
    color: 'red', // Red color for errors
    fontFamily: 'poppins', // Use the same font as the other text
    fontSize: 14, // Font size for the error message
    marginTop: 10, // Add some space above the error message
    textAlign: 'center', // Center the error message
  },
  input: {
    width: "80%",
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "poppins",
    borderBlockColor:"grey"
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
    fontFamily: "poppins",
  },
  signInButton: {
    backgroundColor: "#FAD02E",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "#5c5a5a",
    fontSize: 25,
    fontWeight: "regular",
    textAlign: "center",
    fontFamily: "poppins",
  },
  registerLink: {
    marginTop: 30,
  },
  registerText: {
    color: "black",
    fontSize: 16,
    fontWeight: "regular",
    textDecorationLine: "underline",
    fontFamily: "poppins",
  },
  resetPassword: {
    marginTop: 10,
  },
  resetPasswordText: {
    color: 'blue',
    fontSize: 13,
    textDecorationLine: 'underline',
    fontFamily: 'poppins',
    
  },
  terms: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
  
});