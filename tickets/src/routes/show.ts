import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@23navi/btcommon";
import { Ticket } from "../model/ticket";
import { param } from "express-validator";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  [param("id").not().isEmpty().withMessage("Ticket ID is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new BadRequestError("Ticket not found");
    }

    res.send(ticket);
  }
);

export { router as showTicketRouter };
