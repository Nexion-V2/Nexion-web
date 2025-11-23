"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import axios from "axios";
import { IUser } from "@/types/auth";

interface UseGoogleAuthProps {
  setUser: (user: IUser) => void;
}

export const useGoogleAuth = ({ setUser }: UseGoogleAuthProps) => {
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  const redirectUriRef = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      redirectUriRef.current = `${window.location.origin}/auth/google-callback`;
    }
  }, []);

  // Trigger Google login redirect
  const loginWithGoogle = () => {
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", CLIENT_ID);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUriRef.current);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    window.location.href = googleAuthUrl.toString();
  };

  // Handle Google callback
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && window.location.pathname === "/auth/google-callback") {
      (async () => {
        try {
          const response = await axios.post(`${BACKEND_URL}/api/auth/google-login`, {
            code,
            redirect_uri: redirectUriRef.current,
          });

          const data = response.data;

          if (data.success && data.data) {
            localStorage.setItem("Nexion-user", JSON.stringify(data.data.user));
            document.cookie = `Nexion-token=${data.data.token}; path=/; max-age=${
              7 * 24 * 60 * 60
            }; Secure; SameSite=Strict`;

            setUser(data.data.user);
            router.push("/dashboard");
          } else {
            console.error("Google login failed:", data.message);
          }
        } catch (err) {
          console.error("Google OAuth error:", err);
        }
      })();
    }
  }, [router, BACKEND_URL, setUser]);

  return { loginWithGoogle };
};
