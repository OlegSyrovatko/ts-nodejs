import { ErrorRequestHandler } from "express";
import { MongoError } from "mongodb";

interface ExtendedError extends MongoError {
  status?: number;
}

export const handleMongooseError = (
  error: ExtendedError,
  doc: any,
  next: (err?: any) => void
) => {
  const { name, code } = error;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  console.log(error);
  next(error);
};
