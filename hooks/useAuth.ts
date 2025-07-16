import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    updateUser,
    initializeAuth,
  } = useAuthStore();

  return {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    updateUser,
    initializeAuth,
  };
};
