import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request_validation_error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong." }],
  });
};
