import { Request, Response, NextFunction } from "express";
import HttpError from "../helpers/HttpError";
import Joi from "joi";

interface ValidateBodyFunction {
  (req: Request, res: Response, next: NextFunction): void;
}

export const validateBody = (
  schema: Joi.ObjectSchema
): ValidateBodyFunction => {
  const func: ValidateBodyFunction = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      next(HttpError(400, "missing fields"));
      return;
    }

    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
      return;
    }

    next();
  };

  return func;
};
