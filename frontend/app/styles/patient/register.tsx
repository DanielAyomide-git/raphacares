import { StyleSheet } from 'react-native';

const registerStyles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF', // Adjusted for contrast on gradient
    marginBottom: 10,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  scrollViewContainer: {
    flexGrow: 1, // Ensures the content expands and takes up the full space
    justifyContent: 'center', // Align items vertically in the center if content is smaller than screen size
    paddingBottom: 20, // Add bottom padding to avoid content being cut off at the bottom
  },
  input: {
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 7,
    backgroundColor: 'white',
    borderRadius: 25,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  
  loginContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
  loginText: {
    fontFamily: 'Poppins',
    color: 'black',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: '#FAD02E',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  signUpText: {
    fontFamily: 'Poppins-Bold',
    color: '#5c5a5a',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  
  terms: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default registerStyles;
