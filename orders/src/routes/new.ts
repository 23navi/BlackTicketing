import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@23navi/btcommon";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId")],
  validateRequest, // To catch and throw errors caused by expressValidator
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    return {};
  }
);

export { router as createOrderRouter };
