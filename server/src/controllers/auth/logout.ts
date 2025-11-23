import { Request, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies["Nexion-token"];
  if (!token)
    return res.status(400).json({ success: false, message: "No token provided" });

  try {
    const secret = config.get<string>("jwt.secret");
    const decoded = jwt.verify(token, secret) as { _id: string };

    await User.updateOne(
      { _id: decoded._id },
      { $pull: { "tracking.sessions": { token } } }
    );

    res.clearCookie("Nexion-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // must match login
    });

    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err: any) {
    console.error("Logout error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
