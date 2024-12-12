import axios from "axios";
import { API_BASE_URL } from "./config"; // Ensure this points to your config

// Define types for API payloads
export interface AuthDetails {
  email: string;
  password: string;
  user_type: "medical_practitioner";
  auth_type: "local";
}

export interface ProfileDetails {
  first_name: string;
  last_name: string;
  phone_number?: string;
  practitioner_type: string;
  is_verified: boolean;
  is_available: boolean;
  user_type: "medical_practitioner";
}

export interface RegisterRequest {
  auth_details: AuthDetails;
  profile_details: ProfileDetails;
}

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Adjust timeout as needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Updated register function
export const register = async (userData: RegisterRequest): Promise<any> => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    console.log(response.data)
    return response.data; // Return entire response body
    
  } catch (error: any) {
    console.error("Error during registration:", error.response?.data || error);

    // Throw the entire response data for better handling
    if (error.response) {
      throw error.response.data; // Backend error response
    } else {
      throw new Error("Network error or no response from server");
    }
  }
};
