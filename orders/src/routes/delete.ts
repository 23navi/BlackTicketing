import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  orderStatus,
} from "@23navi/btcommon";
import { param } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { Order } from "../model/order";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  [param("id").not().isEmpty().withMessage("Order ID is required")],
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = orderStatus.Cancelled;
    await order.save();

    return res.status(202).send(order);
  }
);

export { router as deleteOrderRouter };

// Note: We are not deleting the order from the database... the method shouldn't be delete.. we are just going to update the status to cancelled
