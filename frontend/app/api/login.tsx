import axios from "axios";
import { API_BASE_URL } from "./config"; // Import API_BASE_URL from config.ts

// Login API function
export const loginApi = async (email: string, password: string, practitionerType: string) => {
  // Create FormData object
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);
  formData.append("auth_type", "local");
  formData.append("scope", "");
  formData.append("client_id", "");
  formData.append("client_secret", "");

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Return the response including status and data
    return { status: response.status, data: response.data }; 
  } catch (error: any) {
    // Handle error
    throw error.response?.data || "Login failed. Please try again."; 
  }
};
