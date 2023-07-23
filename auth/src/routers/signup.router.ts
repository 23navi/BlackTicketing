import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
const router = express.Router();

// import { DBConnectionError } from "../errors/db-connection-error";
import { RequestValidationError } from "../errors/req-validation-error";
import { BadRequestError } from "../errors/bad-request-error";

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
    if (!errors.isEmpty()) {
      // return res.status(400).send(errors.array());   // We will not be handling the error on our own in each route. we will just call the error handler (if route is sync -> throw . If the route is async -> next(err))

      //Sync route -> throw
      // return next(errors);
      throw new RequestValidationError(errors.array());
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("User already exists");
      throw new BadRequestError("User already exists");
    }

    const user = User.build({
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    // Generate JWT synchronously
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      ...req.session,
      jwt: userJWT,
    };

    return res.status(201).send(user);
  }
);

export { router as signupRouter };
