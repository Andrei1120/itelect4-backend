import { Schema, model } from "mongoose";
import type { LostFoundItemDoc } from "../types/index.js";

const lostFoundItemSchema = new Schema<LostFoundItemDoc>(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      minlength: [3, "title must be at least 3 characters"],
      maxlength: [100, "title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
      minlength: [5, "description must be at least 5 characters"],
      maxlength: [500, "description cannot exceed 500 characters"],
    },
    type: {
      type: String,
      required: [true, "type is required"],
      enum: {
        values: ["lost", "found"],
        message: "type must be either 'lost' or 'found'",
      },
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    status: {
      type: String,
      enum: ["lost", "found", "claimed"],
      default: "lost",
    },
    location: {
      type: String,
      required: [true, "location is required"],
      trim: true,
      minlength: [2, "location must be at least 2 characters"],
      maxlength: [120, "location cannot exceed 120 characters"],
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Transform _id to id and remove internal fields in JSON responses
lostFoundItemSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const LostFoundItem = model<LostFoundItemDoc>(
  "LostFoundItem",
  lostFoundItemSchema,
);
