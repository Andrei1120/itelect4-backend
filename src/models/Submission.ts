import { Schema, model } from "mongoose";
import type { SubmissionDoc } from "../types/index.js";

const submissionSchema = new Schema<SubmissionDoc>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseCode: {
    type: String,
    required: [true, "courseCode is required"],
    uppercase: true,
    trim: true,
  },
  repoUrl: {
    type: String,
    required: [true, "repoUrl is required"],
    match: [/^https:\/\/github\.com\/.+/, "repoUrl must start with https://github.com/"],
  },
  submittedAt: { type: Date, default: Date.now },
  score: { type: Number, min: 0, max: 100 },
});

submissionSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Submission = model<SubmissionDoc>("Submission", submissionSchema);
