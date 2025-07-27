import axios from "axios";
import { User } from "../store/authStore";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: User;
  accessToken: string;
}
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const authService = {
  signIn: async (credentials: SignInCredentials): Promise<SignInResponse> => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Auth service error:", error);
    }
  },

  refreshToken: async (accessToken: string): Promise<string> => {
    try {
      const response = await axios.post(
        "https://your-api.com/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  },
};
