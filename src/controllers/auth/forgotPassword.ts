import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { User } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import sendEmail from "../../helpers/sendEmail";
import { EmailData } from "../../models/user";
import dotenv from "dotenv";

dotenv.config();

const { BASE_URL } = process.env;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

export const forgotPassword = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "User with this email not found");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    const resetUrl = `${BASE_URL}/resetpwd/${resetToken}`;

    const resetEmail: EmailData = {
      to: email,
      subject: "Password Reset",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>`,
    };

    await sendEmail(resetEmail);

    res.status(200).json({ message: "Password reset link sent to your email" });
  }
);
