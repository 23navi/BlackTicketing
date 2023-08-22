import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { requireAuth, validateRequest } from "@23navi/btcommon";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // Problem with this validation check for id being mongoose.. We got some dependency as we are saying that ticket id will be always a mongodb id.. ie: Ticket service will always have mongodb as the database..
      .custom((input) => {
        mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("TicketId must be provided"),
  ],
  validateRequest, // To catch and throw errors caused by expressValidator
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    return {};
  }
);

export { router as createOrderRouter };
