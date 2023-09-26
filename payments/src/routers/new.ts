import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  orderStatus,
  NotAuthorizedError,
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
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === orderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }
    return res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
