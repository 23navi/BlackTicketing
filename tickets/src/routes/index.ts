import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@23navi/btcommon";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  console.log("Hello from list tickets");
  const tickets = await Ticket.find({});
  res.send(tickets);
});

export { router as indexTicketRouter };
