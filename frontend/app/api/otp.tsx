import axios from "axios";
import { API_BASE_URL } from "./config"; // Import the base URL from config.tsx

// Define the type for the meta dictionary
interface Meta {
  password: string;
}

// Function to verify OTP
export const verifyOtp = async (otp: string, user_pwd: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
      token: otp,
      meta: { password: user_pwd }, // Pass user_pwd wrapped in a dictionary
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to request a new OTP
export const requestNewOtp = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/request-reset-token`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
