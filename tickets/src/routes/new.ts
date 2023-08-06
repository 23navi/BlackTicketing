import express, { Request, Response } from "express";
import { requireAuth } from "@23navi/btcommon";

const router = express.Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
  res.status(201).send({});
});

export { router as createTicketRouter };
