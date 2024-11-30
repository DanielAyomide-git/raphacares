import axios from "axios";
import { API_BASE_URL } from "./config";

export const loginApi = async (
  email: string,
  password: string,
  practitionerType: string
) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);
  formData.append("auth_type", "local");
  formData.append("scope", "");
  formData.append("client_id", "");
  formData.append("client_secret", "");
  formData.append("practitioner_type", practitionerType);

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Log the full response for debugging purposes
    console.log("Login API Response:", response.data);

    // Ensure response contains a valid access_token
    const { access_token } = response.data;
    if (!access_token || typeof access_token !== "string") {
      throw new Error("Invalid or missing access_token in API response.");
    }

    // You can save the access_token here (e.g., AsyncStorage.setItem)
    // For example:
    // await AsyncStorage.setItem("access_token", access_token);

    // Return the access_token and additional data if needed
    return { status: response.status, access_token, data: response.data };
  } catch (error: any) {
    // Handle API or unexpected errors
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data?.message || "Invalid Email or Password");
    } else {
      console.error("Unexpected Error:", error.message);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
