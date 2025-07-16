import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthProviderProps {
 children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
 const { initializeAuth } = useAuth();

 useEffect(() => {
  initializeAuth();
 }, []);

 return <>{children}</>;
};


