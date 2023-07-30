import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/tickets", (req: Request, res: Response) => {
  res.status(201).send({});
});

export { router as createTicketRouter };