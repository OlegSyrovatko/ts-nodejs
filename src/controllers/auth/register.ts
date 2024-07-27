import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import crypto from "crypto";
import { User, IUser } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import sendEmail from "../../helpers/sendEmail";
import { EmailData } from "../../models/user";

const { BASE_URL } = process.env;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

export const register = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);

    const verificationToken = crypto.randomBytes(16).toString("hex");

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL: avatarUrl,
      verificationToken,
    });

    const verifyEmail: EmailData = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/verifyeml/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      email: newUser.email,
      subscription: "starter",
    });
  }
);
