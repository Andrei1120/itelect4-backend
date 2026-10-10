import { Router, type Request, type Response } from "express";
import { LostFoundItem } from "../models/LostFoundItem.js";
import { requireAuth } from "../middleware/auth.js";
import type { NewLostFoundItemBody } from "../types/index.js";

export const itemRouter = Router();

// Require valid Bearer token for all routes in this file
itemRouter.use(requireAuth);

interface IdParam {
  id: string;
}

// 1. GET /api/items - list items reported by the authenticated user
itemRouter.get("/", async (req: Request, res: Response) => {
  const items = await LostFoundItem.find({
    reportedBy: req.userId,
  }).sort({ reportedAt: -1 });

  res.json(items);
});

// 2. GET /api/items/:id - get a single item owned by the authenticated user
itemRouter.get("/:id", async (req: Request<IdParam>, res: Response) => {
  const item = await LostFoundItem.findOne({
    _id: req.params.id,
    reportedBy: req.userId,
  });

  if (!item) {
    res.status(404).json({ message: "No item with that id" });
    return;
  }

  res.json(item);
});

// 3. POST /api/items - create a new item attached to the authenticated user
itemRouter.post(
  "/",
  async (
    req: Request<unknown, unknown, NewLostFoundItemBody>,
    res: Response,
  ) => {
    const item = await LostFoundItem.create({
      ...req.body,
      reportedBy: req.userId,
    });

    res.status(201).json(item);
  },
);

// 4. PATCH /api/items/:id - update an existing item owned by the authenticated user
itemRouter.patch(
  "/:id",
  async (
    req: Request<IdParam, unknown, Partial<NewLostFoundItemBody>>,
    res: Response,
  ) => {
    const item = await LostFoundItem.findOneAndUpdate(
      { _id: req.params.id, reportedBy: req.userId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!item) {
      res.status(404).json({ message: "No item with that id" });
      return;
    }

    res.json(item);
  },
);

// 5. DELETE /api/items/:id - delete an item owned by the authenticated user
itemRouter.delete("/:id", async (req: Request<IdParam>, res: Response) => {
  const item = await LostFoundItem.findOneAndDelete({
    _id: req.params.id,
    reportedBy: req.userId,
  });

  if (!item) {
    res.status(404).json({ message: "No item with that id" });
    return;
  }

  res.status(204).send();
});
