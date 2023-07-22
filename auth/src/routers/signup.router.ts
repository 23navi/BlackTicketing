import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

import { DBConnectionError } from "../errors/db-connection-error";
import { RequestValidationError } from "../errors/req-validation-error";

import { User } from "../models/user";

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log("input: ", req.body);
    if (!errors.isEmpty()) {
      // return res.status(400).send(errors.array());   // We will not be handling the error on our own in each route. we will just call the error handler (if route is sync -> throw . If the route is async -> next(err))

      //Sync route -> throw
      // return next(errors);
      throw new RequestValidationError(errors.array());
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).send({ error: "User already exists" });
    }

    const user = User.build({
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    return res.status(201).send(user);
  }
);

export { router as signupRouter };
