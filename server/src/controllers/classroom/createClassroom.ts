import { Request, Response } from "express";
import Classroom, { IClassroom } from "@/models/Classroom/Classroom";

export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id; // Assuming req.user is set by auth middleware

    if (!name || !userId) {
      return res
        .status(400)
        .json({ message: "Classroom name and user ID are required" });
    }

    const newClassroom = new Classroom({
      name,
      description,
      teacherId: userId,
      joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      members: [userId],
      lectureNotes: [],
      discussions: [],
    });

    const savedClassroom: IClassroom = await newClassroom.save();

    res.status(201).json({ success: true, classroom: savedClassroom });
  } catch (error) {
    console.error("Error creating classroom:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create classroom", error });
  }
};
