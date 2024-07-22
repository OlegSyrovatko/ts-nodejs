import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";

import dotenv from "dotenv";

dotenv.config();

const { BASE_URL } = process.env;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

export const resetPassword = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw HttpError(400, "Password reset token is invalid or has expired");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // res.status(200).json({ user, hashPassword });
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  }
);
