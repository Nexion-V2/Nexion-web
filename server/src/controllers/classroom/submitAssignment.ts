import { Request, Response } from "express";
import mongoose from "mongoose";
import Submission, { ISubmission } from "@/models/Classroom/Submission";
import Assignment, { IAssignment } from "@/models/Classroom/Assignment";

// Submit assignment
export const submitAssignment = async (req: Request, res: Response) => {
  try {
    const { classId, assignmentId } = req.params;
    const { content } = req.body;
    console.log("Assignment: ", content);
    const studentId = req.user?.id; // assuming auth middleware sets req.user

    if (!studentId || !assignmentId || !classId) {
      return res
        .status(400)
        .json({ message: "Student ID, assignment ID, and classroom ID are required" });
    }

    // Ensure assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if submission already exists for this student
    const existing = await Submission.findOne({
      assignmentId,
      studentId,
    });

    if (existing) {
      // Update existing submission
      existing.content = content;
      existing.submittedAt = new Date();
      existing.status = "submitted";
      await existing.save();
      return res.status(200).json({ submission: existing });
    }

    // Create new submission
    const submission: ISubmission = new Submission({
      assignmentId: new mongoose.Types.ObjectId(assignmentId),
      studentId: new mongoose.Types.ObjectId(studentId),
      content,
      submittedAt: new Date(),
      status: "submitted",
    });

    await submission.save();

    return res.status(201).json({ submission });
  } catch (error: any) {
    console.error("Submit Assignment Error:", error);
    return res.status(500).json({
      message: "Failed to submit assignment",
      error: error.message,
    });
  }
};
