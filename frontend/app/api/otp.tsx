// api.ts
import axios from "axios";
import { API_BASE_URL } from "./config"; // Import the base URL from config.tsx

// Define the type for the password object
interface PasswordMeta {
  password: string;
}

// Function to verify OTP
export const verifyOtp = async (otp: string, password: PasswordMeta): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
      token: otp,
      meta: password,  // Pass the password object here
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
