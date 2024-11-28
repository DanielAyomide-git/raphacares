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

export interface RegisterResponse {
  message: string;
}

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Adjust timeout as needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Register function
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>("/auth/register", userData);
    return response.data;
  } catch (error: any) {
    console.error("Error during registration:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Enter all entries correctly");
  }
};
