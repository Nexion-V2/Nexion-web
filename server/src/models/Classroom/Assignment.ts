import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  classroomId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  createdBy: Schema.Types.ObjectId;
  discussions: {
    author: Schema.Types.ObjectId;
    message: string;
    timestamp: Date;
  }[];
}

const assignmentSchema = new Schema<IAssignment>(
  {
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    dueDate: {
      type: Date,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    discussions: [
      {
        author: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>("Assignment", assignmentSchema);
