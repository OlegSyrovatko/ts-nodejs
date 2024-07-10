import { Request, Response, NextFunction } from "express";
import { User } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import sendEmail from "../../helpers/sendEmail";
import { EmailData } from "../../models/user";

const { BASE_URL } = process.env;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

import dotenv from "dotenv";
dotenv.config();

interface ResendVerifyEmailRequest extends Request {
  body: {
    email: string;
  };
}

export const resendVerifyEmail = ctrlWrapper(
  async (
    req: ResendVerifyEmailRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "Email not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const { BASE_URL } = process.env;

    const verifyEmail: EmailData = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);
    res.status(200).json({
      message: "Verification email sent",
    });
  }
);
