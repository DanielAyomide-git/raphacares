import { API_BASE_URL } from './config'; // Adjust the import path if necessary

export const requestResetToken = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-reset-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data; // Return response data if the request is successful
  } catch (error) {
    // Ensure the error is always an instance of Error
    throw new Error(error instanceof Error ? error.message : "Network error. Please check your connection.");
  }
};
