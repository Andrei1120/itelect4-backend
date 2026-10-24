import { Router, type Request, type Response } from "express";
import { Submission } from "../models/Submission.js";
import { requireAuth } from "../middleware/auth.js";
import type { NewSubmissionBody } from "../types/index.js";

export const submissionRouter = Router();

// Require valid Bearer token for all routes in this file
submissionRouter.use(requireAuth);

interface IdParam {
  id: string;
}

// 1. GET /api/submissions - list submissions of the authenticated user
submissionRouter.get("/", async (req: Request, res: Response) => {
  const submissions = await Submission.find({
    studentId: req.userId,
  }).sort({ submittedAt: -1 });

  res.json(submissions);
});

// 2. GET /api/submissions/:id - get a single submission owned by the authenticated user
submissionRouter.get("/:id", async (req: Request<IdParam>, res: Response) => {
  const submission = await Submission.findOne({
    _id: req.params.id,
    studentId: req.userId,
  });

  if (!submission) {
    res.status(404).json({ message: "No submission with that id" });
    return;
  }

  res.json(submission);
});

// 3. POST /api/submissions - create a submission attached to the authenticated user
submissionRouter.post(
  "/",
  async (
    req: Request<unknown, unknown, NewSubmissionBody>,
    res: Response,
  ) => {
    const submission = await Submission.create({
      ...req.body,
      studentId: req.userId,
    });

    res.status(201).json(submission);
  },
);

// 4. PATCH /api/submissions/:id - update a submission owned by the authenticated user
submissionRouter.patch(
  "/:id",
  async (
    req: Request<IdParam, unknown, Partial<NewSubmissionBody>>,
    res: Response,
  ) => {
    const submission = await Submission.findOneAndUpdate(
      { _id: req.params.id, studentId: req.userId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!submission) {
      res.status(404).json({ message: "No submission with that id" });
      return;
    }

    res.json(submission);
  },
);

// 5. DELETE /api/submissions/:id - delete a submission owned by the authenticated user
submissionRouter.delete(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    const submission = await Submission.findOneAndDelete({
      _id: req.params.id,
      studentId: req.userId,
    });

    if (!submission) {
      res.status(404).json({ message: "No submission with that id" });
      return;
    }

    res.status(204).send();
  },
);
