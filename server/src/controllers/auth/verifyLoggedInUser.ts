import { Request, Response } from "express";
import { ITokenPayload } from "@/types/auth";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";


// Token verify route
export const verifyLoggedInUser = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get token from HttpOnly cookie
    const token = req.cookies['Nexion-token'];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // 2️⃣ Verify JWT signature
    const key = config.get("jwt.secret") as string;
    const decoded = jwt.verify(token, key) as ITokenPayload;

    // 3️⃣ Database check: user + token in active sessions
    const user = await User.findOne({
      _id: decoded._id,
      email: decoded.email,
      "tracking.sessions.token": token,
    }).select("username name email avatar bio privacy tracking.status _id");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid or revoked token/session" });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user._id,
          username: user.username || null,
          name: user.name || null,
          email: user.email,
          avatar: user.avatar || null,
          bio: user.bio || null,
          privacy: user.privacy || null,
          status: user.tracking.status,
        },
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

