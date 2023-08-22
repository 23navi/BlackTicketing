import express, { Request, Response } from "express";
import { requireAuth } from "@23navi/btcommon";
import { Order } from "../model/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  //Only return the orders for the current use
  const orders = Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");
  return res.send(orders);
});

export { router as indexOrderRouter };
