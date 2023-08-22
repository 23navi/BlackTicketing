import express, { Request, Response } from "express";
import { BadRequestError, requireAuth } from "@23navi/btcommon";
import { param } from "express-validator";
import { Order } from "../model/order";
import { NotFoundError, NotAuthorizedError } from "@23navi/btcommon";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  [param("id").not().isEmpty().withMessage("Order ID is required")],

  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
