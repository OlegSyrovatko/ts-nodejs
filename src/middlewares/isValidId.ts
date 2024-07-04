import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError";

export const isValidId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(400, `${id} is not valid id`));
    return;
  }
  next();
};
