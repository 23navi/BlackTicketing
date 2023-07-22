import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();
    // Only for those case where we are extending from a buildin class (Eg: Express is an inbuild class here)
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
