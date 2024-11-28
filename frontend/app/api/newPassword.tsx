import { API_BASE_URL } from './config'; // Import API base URL from config

// API function to reset password
export const resetPassword = async (otp:string, newPassword:string) => {
  try {
    const payload = {
      token: otp,
      meta: { password: newPassword },
    };

    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Send the payload as JSON
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data; // Return response data if successful
  } catch (error) {
    // Handle and throw error with a meaningful message
    throw new Error(error instanceof Error ? error.message : "Network error. Please check your connection.");
  }
};
