import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import crypto from "crypto";
import { User, IUser } from "../models/user";
import HttpError from "../helpers/HttpError";
import ctrlWrapper from "../helpers/ctrlWrapper";
import sendEmail from "../helpers/sendEmail";
import { EmailData } from "../models/user";

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
      html: `<a target="_blank" href="${BASE_URL}/auth/verify/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      email: newUser.email,
      subscription: "starter",
    });
  }
);

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
