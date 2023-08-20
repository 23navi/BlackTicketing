import express, { Request, Response } from "express";
import { requireAuth } from "@23navi/btcommon";
import { param } from "express-validator";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  [param("id").not().isEmpty().withMessage("Order ID is required")],

  async (req: Request, res: Response) => {
    return {};
  }
);

export { router as showOrderRouter };
