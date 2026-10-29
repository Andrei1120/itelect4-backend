import type { CourseDoc } from "../types/index.js";

// The three courses db.json has held since Session 7, word for word.
// They are reference data: nobody creates a course through the API, so
// they live here and go into the database once, from src/seed.ts.

export const COURSES: CourseDoc[] = [
  {
    code: "ITELECT4",
    title: "IT Elective 4",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
  {
    code: "ITELECT3",
    title: "IT Elective 3",
    units: 3,
    semester: "2nd Semester 2025-2026",
  },
  {
    code: "CSSWENG",
    title: "Software Engineering",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
];
