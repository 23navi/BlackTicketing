import express, { NextFunction, Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@23navi/btcommon";
import { Ticket } from "../model/ticket";
import { param } from "express-validator";

const router = express.Router();



export { router as updateTicketRouter };