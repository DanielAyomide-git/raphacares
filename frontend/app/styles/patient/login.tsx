import { StyleSheet } from 'react-native';

const loginStyles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontFamily: 'poppins-bold',
    fontSize: 24,
    color: '#00CDF9', // Adjust for better contrast on blue gradient
    marginBottom: 50,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  errorText: {
    color: 'red', // Red color for errors
    fontFamily: 'poppins', // Use the same font as the other text
    fontSize: 14, // Font size for the error message
    marginTop: 10, // Add some space above the error message
    textAlign: 'center', // Center the error message
  },
  icon: {
    width: 40,
    height: 40,
  },
  input: {
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: '#94ebff',
    borderRadius: 25,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'poppins',
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    fontFamily: 'poppins',
  },
  forgotPassword: {
    color: '#5c5a5a',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontFamily: 'poppins',
  },
  signInButton: {
    backgroundColor: '#00CDF9',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  signInText: {
    color: '#5c5a5a',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  registerLink: {
    marginTop: 30,
  },
  registerText: {
    color: '#00CDF9',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'poppins',

  },
  resetPassword: {
    marginTop: 10,
  },
  resetPasswordText: {
    color: '#FFB815',
    fontSize: 13,
    textDecorationLine: 'underline',
    fontFamily: 'poppins',
    
  },
  terms: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
  },
  scrollViewContainer: {
    flexGrow: 1, // Ensures the content expands and takes up the full space
    justifyContent: 'center', // Centers content if there is less content than screen height
    paddingBottom: 20, // Adds padding to avoid content being cut off at the bottom
  },
});

export default loginStyles;
