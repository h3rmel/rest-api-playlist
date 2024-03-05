import { CustomError } from "../utils/errors";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //* Handled Errors
  if (err instanceof CustomError) {
    const { status, logging, message } = err;

    if (logging) {
      console.error(message);
    }

    return res.status(status).send({ message });
  }

  // Unhandled errors
  console.error(JSON.stringify(err, null, 2));
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};
