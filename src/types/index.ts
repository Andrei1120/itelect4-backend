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
