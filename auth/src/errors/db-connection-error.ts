const reasons = ["Failed to connect to db"];
export class DBConnectionError extends Error {
  reasons: string[] = reasons;
  constructor() {
    super();
    // Only for those case where we are extending from a buildin class (Eg: Express is an inbuild class here)
    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }
}
