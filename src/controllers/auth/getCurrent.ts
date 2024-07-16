import { Request, Response, NextFunction } from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import { IUser, User } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import { Token } from "../../models/user";

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

    const tokenDoc = await Token.findOne({ email: user.email });

    if (!tokenDoc) {
      throw HttpError(401, "Refresh token not found");
    }

    res.json({
      email: user.email,
      subscription: user.subscription,
      name: user.name,
      avatarURL: user.avatarURL,
      movieIds: user.movieIds,
      tokenRefresh: tokenDoc.tokenRefresh,
    });
  }
);
