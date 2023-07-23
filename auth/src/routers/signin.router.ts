import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
const router = express.Router();

import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import { Password } from "../services/password";
import { RequestValidationError } from "../errors/req-validation-error";

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const passwordMatch = await Password.compare(
      user.password,
      req.body.password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid Credentials");
    }
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
    res.send(user);
  }
);

export { router as signinRouter };
