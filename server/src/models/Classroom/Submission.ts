import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  assignmentId: Schema.Types.ObjectId;
  studentId: Schema.Types.ObjectId;
  content?: string;
  submittedAt: Date;
  status: "submitted" | "graded" | "late";
  grade?: number;
  feedback?: string;
}

const submissionSchema = new Schema<ISubmission>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String, // Text or file URL
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["submitted", "graded", "late"],
      default: "submitted",
    },

    grade: {
      type: Number,
    },

    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISubmission>("Submission", submissionSchema);
