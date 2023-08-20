import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@23navi/btcommon";
import { param } from "express-validator";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  [param("id").not().isEmpty().withMessage("Order ID is required")],
  requireAuth,
  async (req: Request, res: Response) => {
    return {};
  }
);

export { router as deleteOrderRouter };
