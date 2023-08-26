import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@23navi/btcommon";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .isString()
      .withMessage("Title must be provided as string"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest, // To catch and throw errors caused by expressValidator
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    try {
      console.log("This here is working fine befor async to TicketCreated");
      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: ticket.version,
      });
      console.log("This here is working fine after async to TicketCreated");
    } catch (err) {
      console.log("Something went wrong from tickets/new");
      console.log(err);
    }

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
