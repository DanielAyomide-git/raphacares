import axios from "axios";
import { API_BASE_URL } from "./config"; // Ensure this points to your config

// Define types for API payloads
export interface AuthDetails {
  email: string;
  password: string;
  user_type: "patient";
  auth_type: "local";
}

export interface ProfileDetails {
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_verified: boolean;
  is_available: boolean;
  user_type: "patient";
}

export interface RegisterRequest {
  auth_details: AuthDetails;
  profile_details: ProfileDetails;
}

// Define type for the user
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // To include any additional fields dynamically
}

// Extended RegisterResponse to include user
export interface RegisterResponse {
  message: string;
  user: User; // Include user information
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
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
