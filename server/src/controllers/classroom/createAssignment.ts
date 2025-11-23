import { Request, Response } from "express";
import Assignment, { IAssignment } from "@/models/Classroom/Assignment";
import Classroom, { IClassroom } from "@/models/Classroom/Classroom";
import { FlattenMaps } from "mongoose";

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const classId = req.params.classId;
    const { title, description, dueDate, dueTime } = req.body;
    console.log("New Assignment Request for classId: ", classId, " ", req.body);
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing." });
    }
    // Fetch the classroom to ensure the user is the teacher
    const classroom: FlattenMaps<IClassroom> | null = await Classroom.findById(
      classId
    ).lean();
    if (!classroom) {
      return res
        .status(404)
        .json({ success: false, message: "Classroom not found." });
    }

    const newAssignment = new Assignment({
      classroomId: classId,
      title,
      description,
      dueDate,
      dueTime,
      createdBy: userId,
    });
    await newAssignment.save();

    res.status(201).json({ success: true, assignment: newAssignment });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error: Unable to create assignment.",
      });
  }
};
