import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LinearGradient
      colors={["#00CDF9", "white"]} // From yellow to white
      style={styles.container} // Apply the container styles for layout
    >
      {children}
    </LinearGradient>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Allow the content to grow and scroll if needed
    justifyContent: "center", // Center the content vertically when there's space
    alignItems: "center",
    paddingVertical: 20,
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
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
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
    color:"#FFB815",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
});