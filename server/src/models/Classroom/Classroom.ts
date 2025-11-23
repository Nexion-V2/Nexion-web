import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for TypeScript
export interface IClassroom extends Document {
  name: string;
  description?: string;
  teacherId: Types.ObjectId;           // mongoose.Types.ObjectId
  joinCode: string;
  members: Types.ObjectId[];           // array of ObjectIds
  lectureNotes: {
    title: string;
    date: Date;
    url: string;
  }[];
  discussions: {
    author: Types.ObjectId;
    message: string;
    timestamp: Date;
    replies: number;
  }[];
}

// Mongoose schema
const classroomSchema = new Schema<IClassroom>(
  {
    name: { type: String, required: true },
    description: { type: String },

    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    joinCode: { type: String, unique: true, required: true },

    members: [{ type: Schema.Types.ObjectId, ref: "User" }],

    lectureNotes: [
      {
        title: { type: String, required: true },
        date: { type: Date, default: Date.now },
        url: { type: String, required: true },
      },
    ],

    discussions: [
      {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        replies: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IClassroom>("Classroom", classroomSchema);
