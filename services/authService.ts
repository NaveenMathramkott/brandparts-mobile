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

export const authService = {
  signIn: async (credentials: SignInCredentials): Promise<SignInResponse> => {
    console.log("credentials", credentials);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://192.168.1.147:5000/api/auth/login",
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
      throw error;
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
