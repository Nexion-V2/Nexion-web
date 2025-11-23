import { Request, Response } from "express";
import Classroom, { IClassroom } from "@/models/Classroom/Classroom";
import Assignment, { IAssignment } from "@/models/Classroom/Assignment";
import Submission, { ISubmission } from "@/models/Classroom/Submission";
import { FlattenMaps } from "mongoose";

/**
 * @route GET /api/v1/classrooms
 * @description Fetch classrooms for which user is member or teacher
 * @access Private
 */
export const getClassrooms = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing." });
    }

    // Fetch classrooms where user is a member OR teacher
    const classrooms: FlattenMaps<IClassroom>[] = await Classroom.find({
      $or: [{ teacherId: userId }, { members: userId }],
    }).lean();

    if (!classrooms) {
      return res
        .status(404)
        .json({ success: false, message: "No classrooms found for the user." });
    }

    // Add isTeacher flag, hide joinCode, attach assignments & submissions
    const formattedClassrooms = await Promise.all(
      classrooms.map(async (cls) => {
        const isTeacher = cls.teacherId.toString() === userId.toString();

        // Fetch assignments for this classroom
        const assignments = await Assignment.find({
          classroomId: cls._id,
        }).lean();

        // Fetch submissions for these assignments
        const assignmentIds = assignments.map((a) => a._id);
        const submissionsRaw = await Submission.find({
          assignmentId: { $in: assignmentIds },
        })
          .populate("studentId", "name email") // populate studentId with name & email
          .lean();

        const submissions = submissionsRaw.map((sub) => ({
          _id: sub._id,
          assignmentId: sub.assignmentId,
          studentName: sub.studentId && (sub.studentId as any).name,
          content: sub.content,
          submittedAt: sub.submittedAt,
          status: sub.status,
          grade: sub.grade,
          feedback: sub.feedback,
        }));

        return {
          ...cls,
          isTeacher,
          joinCode: isTeacher ? cls.joinCode : undefined,
          assignments: assignments.map((assignment) => ({
            ...assignment,
            submissions,
          })),
        };
      })
    );

    console.log("All Classrooms: ", formattedClassrooms);

    res.status(200).json({ success: true, classrooms: formattedClassrooms });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch classrooms.",
    });
  }
};
