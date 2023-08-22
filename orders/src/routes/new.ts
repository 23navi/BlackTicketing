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
import { Ticket } from "../model/ticket";
import { Order } from "../model/order";

const EXPIRATION_SECONDS = 60 * 15; // 15 min

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
        return mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("TicketId must be provided"),
  ],
  validateRequest, // To catch and throw errors caused by expressValidator
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // So the goal of this is to first find the ticket the user is trying to order in the database. (We created the copy of all tickets in our orders db using the event)
    // So if the ticketId given by the user is valid.. The second thing we have to check is that ticket is available to take order... Like a ticket can be reserved by someone else.. So we will only allow someone to create an order for a ticket in a situation where there is on existing orders for it.. or if there are orders for that ticket.. then them must all be canceled orders.

    // 1) Finding the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // 2) Checking if the ticket is already reserved.. For this we will get all the orders where ticket is this ticket and status is something other than canceled
    // const orders = await Order.find({
    //   ticket: ticket,
    //   status: { $ne: "cancelled" },
    // });
    // if (orders.length > 0) {
    //   throw new BadRequestError("Ticket is already reserved");
    // }
    // The above code is right... but we want this in a lot of upcoming places... same logic.. So it will be better to have it as a method on the ticket itself.
    // So we can do ticket.isReserved() which will give true or false...

    if (await ticket.isReserved()) {
      throw new BadRequestError("Ticket is already reserved");
    }
    // 3) We are ready to make the order. So calculate the expiration time
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

    // 4) Creating the order
    const order = Order.build({
      expiresAt: expiration,
      status: orderStatus.Created,
      userId: req.currentUser!.id,
      ticket,
    });
    await order.save();

    // 5) Publishing an event saying that an order was created

    return res.status(201).send(order);
  }
);

export { router as createOrderRouter };
