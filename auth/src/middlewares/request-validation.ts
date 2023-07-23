import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/req-validation-error";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).send(errors.array());   // We will not be handling the error on our own in each route. we will just call the error handler (if route is sync -> throw . If the route is async -> next(err))

    //Sync route -> throw
    // return next(errors);
    throw new RequestValidationError(errors.array());
  }
  next();
};
