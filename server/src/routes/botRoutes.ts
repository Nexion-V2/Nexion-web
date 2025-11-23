import { Router } from "express";
import { removeBackground } from "@/controllers/bots/remove-bg";
import { pdfToDocx } from "@/controllers/bots/pdf-to-docx";
import { verifyToken } from "@/middleware/verifyToken";
import { upload } from "@/middleware/multerConfig";

const router = Router();

// Routes that require authentication and file upload
router.post("/bg-remove", verifyToken, upload.single("image"), removeBackground);
router.post("/pdf-to-docx", verifyToken, upload.single("file"), pdfToDocx);


export default router;
