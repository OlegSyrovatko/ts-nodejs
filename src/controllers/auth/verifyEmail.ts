import { Request, Response, NextFunction } from "express";

import { User } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";

const { BASE_URL } = process.env;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

export const verifyEmail = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });

    res.status(200).json({ message: "Verification successful" });
  }
);
