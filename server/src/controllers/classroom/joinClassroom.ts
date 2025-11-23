import { Request, Response } from "express";
import mongoose from "mongoose";
import Classroom, { IClassroom } from "@/models/Classroom/Classroom";

export const joinClassroom = async (req: Request, res: Response) => {
  try {
    const { joinCode } = req.body;
    const userId = req.user?.id;
    console.log("Classroom Join Request: ", joinCode);

    if (!joinCode || !userId) {
      return res
        .status(400)
        .json({ message: "Join code and user ID are required" });
    }

    const classroom: IClassroom | null = await Classroom.findOne({ joinCode });
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Convert userId string to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Cast members to Types.ObjectId[]
    const members = classroom.members as unknown as mongoose.Types.ObjectId[];

    // Check if user is already a member
    const isMember = members.some((m) => m.equals(userObjectId));
    if (isMember) {
      return res
        .status(400)
        .json({ message: "Already a member of this classroom" });
    }

    // Add user to members
    classroom.members.push(userObjectId);
    await classroom.save();

    return res.status(200).json(classroom);
  } catch (error) {
    console.error("Join Classroom Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
