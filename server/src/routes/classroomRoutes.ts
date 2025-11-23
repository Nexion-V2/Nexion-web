import { Router } from 'express';
import { verifyToken } from "@/middleware/verifyToken";
import { getClassrooms } from "@/controllers/classroom/getClassrooms";
import { createClassroom } from "@/controllers/classroom/createClassroom";
import { createAssignment } from '@/controllers/classroom/createAssignment';
import { joinClassroom } from '@/controllers/classroom/joinClassroom';
import { deleteAssignment } from '@/controllers/classroom/deleteAssignment';
import { submitAssignment } from '@/controllers/classroom/submitAssignment';

const router = Router();

// Define classroom routes here
router.get("/classes", verifyToken, getClassrooms);
router.post("/classes", verifyToken, createClassroom);
router.get("/classes/:classId", verifyToken,);
router.post("/classes/:classId/assignments", verifyToken, createAssignment);
router.delete("/classes/:classId/assignments/:assignmentId", verifyToken, deleteAssignment);

router.post(
  "/classes/:classId/assignments/:assignmentId/submissions",
  verifyToken,
  submitAssignment
);
router.post("/classes/join", verifyToken, joinClassroom);
router.put("/classes/:classId", verifyToken, );
router.delete("/classes/:classId", verifyToken, );

export default router;