import { Request, Response, NextFunction } from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import { IUser, User, Token } from "../../models/user";
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

    const tokenDoc = await Token.findOne({ email: user.email });

    if (!tokenDoc) {
      throw HttpError(401, "Refresh token not found");
    }

    res.json({
      token: user.token,
      tokenRefresh: tokenDoc.tokenRefresh,
      user: {
        name: user.name,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
        movieIds: user.movieIds,
      },
    });
  }
);
