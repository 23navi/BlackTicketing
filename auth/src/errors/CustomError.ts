export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    // The message will be passed to Error() constructor.. will be used to log error message.. not to be send as response
    super(message);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // return type of the serializeErrors function is an array of objects
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
