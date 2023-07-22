import { CustomError } from "./CustomError";

export class RouteNotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Route not foundddddd");
    Object.setPrototypeOf(this, RouteNotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Route not founddddddddd" }];
  }
}
