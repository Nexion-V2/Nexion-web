import { Request, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";
import axios from "axios";
import { IUser } from "@/models/User/Types";
import { ISession, ILoginHistory } from "@/models/User/UserTrackingSchema";
import { IAuthProvider } from "@/models/User/UserOAuthSchema";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code, redirect_uri } = req.body;

    if (!code || !redirect_uri) {
      return res.status(400).json({ success: false, message: "Missing code or redirect_uri" });
    }

    // 1️⃣ Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: config.get("google.clientId"),
        client_secret: config.get("google.clientSecret"),
        redirect_uri,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // 2️⃣ Fetch user info
    const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { sub: googleId, email, name, picture: avatar } = userInfoRes.data;

    if (!email || !googleId) {
      return res.status(400).json({ success: false, message: "Google user info invalid" });
    }

    // 3️⃣ Find or create user
    let user = (await User.findOne({
      $or: [
        { email },
        { "authProviders.provider": "google", "authProviders.providerId": googleId },
      ],
    })) as IUser | null;

    const now = new Date();
    const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
    const ip = Array.isArray(ipRaw) ? ipRaw[0] : String(ipRaw);
    const userAgent = (req.headers['user-agent'] as string) || "Unknown Device";

    const googleAuthProvider: IAuthProvider = {
      provider: "google",
      providerId: googleId,
      email,
      avatar,
    };

    if (!user) {
      // Check if user exists with same email
      const existingUser = (await User.findOne({ email })) as IUser | null;
      if (existingUser) {
        // Link Google account
        const alreadyLinked = existingUser.authProviders.some(
          p => p.provider === "google" && p.providerId === googleId
        );
        if (!alreadyLinked) existingUser.authProviders.push(googleAuthProvider);
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = new User({
          name,
          email,
          username: email.split("@")[0],
          avatar,
          authProviders: [googleAuthProvider],
        });
      }
    } else {
      // User found via providerId, update if necessary
      const linkedProvider = user.authProviders.find(p => p.provider === "google");
      if (linkedProvider) {
        linkedProvider.email = email;
        linkedProvider.avatar = avatar;
      }
    }

    if (!user) throw new Error("User creation failed");

    // 4️⃣ Generate JWT
    const jwtSecret = config.get<string>("jwt.secret");
    const jwtToken = jwt.sign({ _id: user._id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    // 5️⃣ Update Tracking & Session
    const newSession: Partial<ISession> = {
      ipAddress: ip,
      userAgent,
      token: jwtToken,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    };
    user.tracking.sessions.push(newSession as ISession);

    const loginEntry: Partial<ILoginHistory> = {
      ipAddress: ip,
      userAgent,
      loginMethod: "google",
      status: "success",
      loginAt: now,
    };
    user.tracking.loginHistory.push(loginEntry as ILoginHistory);

    user.tracking.lastSeen = now;
    user.tracking.lastActiveAt = now;
    user.tracking.status = "online";

    await user.save();

    // 6️⃣ Send response
    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        token: jwtToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          session: newSession,
          authProviders: user.authProviders,
          status: user.tracking.status,
        },
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ success: false, message: "Google login failed" });
  }
};

export default googleLogin;
