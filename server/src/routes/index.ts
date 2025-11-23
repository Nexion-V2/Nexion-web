import { Router } from "express";
import authRoutes from "./authRoutes";
// import UploadRoutes from "@/controllers/upload";
import profileRoutes from "./profileRoutes";
import chatRoutes from "./chatRoutes";
import botRoutes from "./botRoutes";
import classroomRoutes from "./classroomRoutes";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
// router.use("/upload", UploadRoutes);
router.use("/profile", profileRoutes);
// Chat routes
router.use("/chat", chatRoutes);
// Bot routes
router.use("/bot", botRoutes);
// Classroom routes
router.use("/classroom", classroomRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
