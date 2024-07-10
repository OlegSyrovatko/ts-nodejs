import { Request, Response } from "express";
import { User, Token, Session } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";

export const logout = ctrlWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const user = await User.findByIdAndUpdate(_id, { token: "" });

    const currentSession = req.session;
    const sessionDeletionResult = await Session.deleteOne({
      _id: currentSession?._id,
    });

    if (!user || !sessionDeletionResult) {
      throw HttpError(401, "Not authorized");
    }

    const tokenRefresh = await Token.findOneAndDelete({
      userEmail: user.email,
    });
    if (!tokenRefresh) {
      throw HttpError(401, "User email invalid or unauthorized");
    }

    res.status(204).json({ message: "No Content" });
  }
);
