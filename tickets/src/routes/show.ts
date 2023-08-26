import express, { NextFunction, Request, Response } from "express";
import { validateRequest, NotFoundError } from "@23navi/btcommon";
import { Ticket } from "../model/ticket";
import { param } from "express-validator";

const router = express.Router();

// Add a check to catch error that the id given is in-valid mongodb id..

router.get(
  "/api/tickets/:id",
  [
    param("id").not().isEmpty().withMessage("Ticket ID is required"),
    param("id").isMongoId().withMessage("Ticket ID is invalid"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export { router as showTicketRouter };
