import { StyleSheet } from "react-native";

const indexStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop:60

  },
  animatedBackground: {
    position: "absolute",
    width: "100%",
    height: "50%",
  },
 
  animatedContainer: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  welcomeText: {
    fontSize: 15,
    fontFamily: "poppins-bold",
    color: "#00CDF9",
    marginVertical: 20,
    textAlign: "center",
  },
  doctorImage: {
    width: "65%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 100,
    marginTop: 50,
    borderRadius: 15,
    overflow: "hidden",
  },
  questionContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    marginTop: 500,

  },
  questionText: {
    fontSize: 30,
    fontFamily: "poppins-Semibold",
    color: "white",
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "80%",
  },
  buttonYes: {
    backgroundColor: "#FFB815",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 25, 

  },
  buttonNo: {
    backgroundColor: "#00CDF9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "poppins",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default indexStyles;
