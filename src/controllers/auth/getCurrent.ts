import { Request, Response, NextFunction } from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import { IUser } from "../../models/user";

export const getCurrent = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, subscription }: IUser = req.user as IUser;
    res.json({ email, subscription });
  }
);
