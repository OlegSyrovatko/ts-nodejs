import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";

export const updateSubscription = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { subscription = "starter" } = req.body;
    const { _id } = req.user as IUser & { _id: string };

    try {
      const data = await User.findByIdAndUpdate(
        _id,
        { subscription },
        { new: true }
      );

      if (!data) {
        throw HttpError(404, "Not found");
      }

      res.status(200).json(data);
    } catch (error: any) {
      next(HttpError(500, `Failed to update subscription: ${error.message}`));
    }
  }
);
