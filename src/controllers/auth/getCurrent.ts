import { Request, Response, NextFunction } from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import { IUser, User } from "../../models/user";
import HttpError from "../../helpers/HttpError";

export const getCurrent = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req.user as IUser)._id;

    if (!userId) {
      throw HttpError(401, "Unauthorized");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    res.json({
      email: user.email,
      subscription: user.subscription,
      name: user.name,
      avatarURL: user.avatarURL,
      movieIds: user.movieIds,
    });
  }
);
