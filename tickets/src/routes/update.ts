import express, { NextFunction, Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
} from "@23navi/btcommon";
import { Ticket } from "../model/ticket";
import { param, body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",

  requireAuth,
  [
    param("id").not().isEmpty().withMessage("Ticket ID is required"),
    param("id").isMongoId().withMessage("Ticket ID is invalid"),
    body("title")
      .not()
      .isEmpty()
      .isString()
      .withMessage("Title must be provided as string"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();

      // We are using express-async-error.. so we don't have to catch and pass the error to next().. we can directly throw
      // return next(new BadRequestError("Ticket not found"));
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ ...ticket, title, price });

    await ticket.save();

    try {
      console.log("This here is working fine befor async to TicketUpdated");
      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
      });
      console.log("This here is working fine after async to TicketUpdated");
    } catch (err) {
      console.log("Something went wrong from tickets/update");
      console.log(err);
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
