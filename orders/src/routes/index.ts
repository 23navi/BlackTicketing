import express, { Request, Response } from "express";
import { requireAuth } from "@23navi/btcommon";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  return {};
});

export { router as indexOrderRouter };
