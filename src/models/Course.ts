import { Schema, model } from "mongoose";
import type { CourseDoc } from "../types/index.js";

// The third Session 1 interface, written a second time as a schema --
// the same move User and Submission made last week. Courses are the
// one thing this API serves to somebody who is not logged in.

const courseSchema = new Schema<CourseDoc>({
  // unique here is the reason GET /api/courses/ITELECT4 can use
  // findOne and be sure there is nothing else it could have matched.
  code: {
    type: String,
    required: [true, "code is required"],
    unique: true,
    uppercase: true,
    trim: true,
  },
  title: { type: String, required: [true, "title is required"], trim: true },
  units: { type: Number, required: true, min: 1, max: 6 },
  semester: { type: String, required: true, trim: true },
});

courseSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Course = model<CourseDoc>("Course", courseSchema);
