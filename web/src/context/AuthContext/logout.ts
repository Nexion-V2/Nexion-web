// logoutUser.ts
import axios from "axios";
import { StorageClear } from "./StorageClear";
import type { NextRouter } from "next/router";

export const logoutUser = async (
  setUser: (user: any | null) => void,
  router: NextRouter
) => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    console.log("Server session successfully revoked.");
  } catch (error: any) {
    console.error("Failed to revoke server session:", error?.message || error);
  } finally {
    setUser(null);
    StorageClear();
    router.push("/auth/login");
  }
};
