const reasons = ["Failed to connect to db"];
import { CustomError } from "./CustomError";
export class DBConnectionError extends CustomError {
  statusCode = 500;
  reasons: string[] = reasons;
  constructor() {
    super("Unable to connect to database");
    // Only for those case where we are extending from a buildin class (Eg: Express is an inbuild class here)
    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }
  serializeErrors() {
    return this.reasons.map((reason) => ({ message: reason }));
  }
}
