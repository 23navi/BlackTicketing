import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

import { DBConnectionError } from "../errors/db-connection-error";
import { RequestValidationError } from "../errors/req-validation-error";

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).send(errors.array());   // We will not be handling the error on our own in each route. we will just call the error handler (if route is sync -> throw . If the route is async -> next(err))

      //Sync route -> throw
      // return next(errors);
      throw new RequestValidationError(errors.array());
    }

    res.send("Hi there!, All clear");
  }
);

export { router as signupRouter };
