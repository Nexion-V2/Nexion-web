"use client";
import { Loader2 } from "lucide-react";
import { useGoogleAuth } from "@/context/AuthContext/useGoogleAuth";
import { useAuth } from "@/context/AuthContext";

export default function GoogleCallbackPage() {
  // const { setUser, setToken } = useAuth();
  // useGoogleAuth({ setUser, setToken });
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-3 text-center">
      <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      <p className="text-gray-400 text-lg">Processing your Google login...</p>
    </div>
  );
}
