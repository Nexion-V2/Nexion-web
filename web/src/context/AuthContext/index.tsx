"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { IUser, AuthContextType } from "@/types/auth";
import { useRouter } from "next/navigation";
import { ValidationCheck } from "./ValidationCheck";
import { useGoogleAuth } from "./useGoogleAuth";
import { useGithubAuth } from "./useGithubAuth";
import { loginUser } from "./login";
import { signupUser } from "./SignUp";
import { logoutUser } from "./logout";

// -------------------- Context & Hook --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// -------------------- Provider Component --------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ---------- State ----------
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Auth Check
  useEffect(() => {
    ValidationCheck(setUser, setIsLoading);
  }, []);

  // ---------- Login ----------
  const login = (email: string, password: string, rememberMe: boolean) => {
    return loginUser(email, password, rememberMe, setUser);
  };

  // ---------- Signup ----------
  const signup = (email: string, password: string, username: string) => {
    return signupUser(email, password, username, setIsLoading);
  };

  // ---------- Logout ----------
  const logout = () => {
    // CRITICAL FIX: Pass the 'token' state variable to logoutUser
    // The arguments (storedToken, setUser, setToken, setIsLoading) are unnecessary here
    // as they are already available in the component's scope.
    return logoutUser(setUser, router);
  };
  // ---------- Login with Google ----------
  const { loginWithGoogle } = useGoogleAuth({
    setUser,
  });

  // ---------- Login with GitHub ----------
  const { loginWithGithub } = useGithubAuth({
    setUser,
  });

  // ---------- Context Value ----------
  const value = {
    user,
    setUser,
    login,
    loginWithGoogle,
    loginWithGithub,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  // ---------- Render ----------
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
