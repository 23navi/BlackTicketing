import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  orderStatus,
} from "@23navi/btcommon";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { Order } from "../models/orders";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("orderId")
      .not()
      .isEmpty()
      .custom((input) => {
        return mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("OrderId must be provided"),
    body("token").not().isEmpty().withMessage("Token must be provided"),
  ],
  validateRequest, // To catch and throw errors caused by expressValidator
  async (req: Request, res: Response) => {
    return res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
