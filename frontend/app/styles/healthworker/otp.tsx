// styles.js

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  successText: {
    color: "green", // Green color to indicate success
    fontSize: 14, // Adjust font size as needed
    textAlign: "center", // Center the text
    marginTop: 10, // Add some spacing from the other elements
    fontWeight: "bold", // Make the text bold
  },
  
  card: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: "center",
    color: "blue",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 14,
    color: "#333",
  },
  otp: {
    color: "blue",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  resendButton: {
    marginTop: 10,
    paddingVertical: 10,
  },
  resendText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  countdownText: {
    fontSize: 14,
    color: "blue",
    textAlign: "center",
    marginVertical: 10, // Added space between countdown and submit button
  },
});

export default styles;
