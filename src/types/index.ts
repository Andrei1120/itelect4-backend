import type { Types } from "mongoose";

// FROM SESSION 1: The interfaces for the Lost and Found application
export const Role = {
  Student: "student",
  SecurityAdmin: "security_admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface LostFoundItem {
  id: number;
  title: string;
  description: string;
  type: "lost" | "found";
  category?: string;
  status?: "lost" | "found" | "claimed";
  location: string;
  reportedAt: Date;
  reportedBy: number;
}

// ---------------------------------------------------------------------
// Derived types for Mongoose documents and request payloads

export type UserDoc = Omit<User, "id"> & {
  password: string;
};

export type LostFoundItemDoc = Omit<LostFoundItem, "id" | "reportedBy"> & {
  reportedBy: Types.ObjectId;
};

export type NewLostFoundItemBody = Pick<
  LostFoundItem,
  "title" | "description" | "type" | "location"
> & {
  category?: string;
  status?: "lost" | "found" | "claimed";
};

// Course types
export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export type CourseDoc = Pick<
  Course,
  "code" | "title" | "units" | "semester"
>;

// Submission types (for full compatibility with all lecture specifications)
export interface Submission {
  id: number;
  studentId: number;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
  score?: number;
}

export type SubmissionDoc = Omit<Submission, "id" | "studentId"> & {
  studentId: Types.ObjectId;
};

export type NewSubmissionBody = Pick<Submission, "courseCode" | "repoUrl">;

