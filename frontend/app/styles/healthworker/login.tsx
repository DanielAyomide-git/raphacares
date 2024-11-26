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

  
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#00CDF9",
    borderRadius: 25,
    textAlign: "center",
    fontFamily: "Poppins",
    color: "#706d6d",
  },
  input: {
    width: "80%",
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "poppins",
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
  terms: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
});