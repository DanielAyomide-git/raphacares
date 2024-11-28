import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFFFFF", // Text color for better contrast
    marginBottom: 10,
    textAlign: "center",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  input: {
    width: "80%",
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  loginText: {
    fontFamily: "Poppins",
    color: "black",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  loginContainer: {
    marginTop: 10,
  },
  pickerContainer: {
    width: "80%",
    marginBottom: 10,
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
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: "#FAD02E",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
    marginBottom: 5,
  },
  signUpText: {
    fontFamily: "Poppins-Bold",
    color: "#5c5a5a",
    fontSize: 15,
    textAlign: "center",
  },
  terms: {
    color: "black",
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
  },
});
