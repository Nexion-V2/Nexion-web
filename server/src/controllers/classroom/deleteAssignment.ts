import { Request, Response } from "express";
import Classroom, { IClassroom } from "@/models/Classroom/Classroom";
import Assignment, { IAssignment } from "@/models/Classroom/Assignment";

export const deleteAssignment = async (req: Request, res: Response) => {
  const { classId, assignmentId } = req.params;
  console.log("Delete....", { classId, assignmentId });
  try {
    const classroom: IClassroom | null = await Classroom.findById(classId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    const assignment: IAssignment | null = await Assignment.findByIdAndDelete(
      assignmentId
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
