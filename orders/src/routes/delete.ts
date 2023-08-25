import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  orderStatus,
} from "@23navi/btcommon";
import { param } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/order-cancelled-publisher";
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

    // 5) Publishing an event saying that an order was created

    try {
      console.log("This here is working fine befor async to OrderCancelled");
      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
          id: order.ticket.id,
        },
      });
      console.log("This here is working fine after async to OrderCancelled");
    } catch (err) {
      console.log("Something went wrong from order/delete");
      // console.log(err);
    }

    return res.status(202).send(order);
  }
);

export { router as deleteOrderRouter };

// Note: We are not deleting the order from the database... the method shouldn't be delete.. we are just going to update the status to cancelled
