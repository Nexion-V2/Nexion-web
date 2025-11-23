import axios, { AxiosError } from "axios";
import { IUser } from "@/types/auth";
import { StorageClear } from "./StorageClear";

interface IVerifyUser {
  id: string;
  name?: string;
  username: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
}

interface IVerifyResponse {
  success: boolean;
  message: string;
  data: {
    user: IVerifyUser;
  };
}

export const ValidationCheck = async (
  setUser: (user: IUser | null) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  try {
    setIsLoading(true);

    const response = await axios.get<IVerifyResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
      {
        withCredentials: true, // ⚡ Important! Cookie is sent automatically
        validateStatus: (status) => status < 500,
      }
    );

    const { status, data } = response;

    if (status === 200 && data.success && data.data.user) {
      setUser({
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name ?? "",
        username: data.data.user.username,
        avatar: data.data.user.avatar ?? undefined,
        bio: data.data.user.bio ?? undefined,
      });
    } else {
      setUser(null);
      StorageClear();
      console.warn("Auth failed, logging out.");
    }
  } catch (error: AxiosError | unknown) {
    console.error("Validation check failed:", error);
    setUser(null);
  } finally {
    setIsLoading(false);
  }
};

