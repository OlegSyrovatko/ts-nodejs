import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Token, Session, IUser, JwtPayload } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import dotenv from "dotenv";

dotenv.config();

const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
  throw new Error(
    "SECRET_KEY or REFRESH_SECRET_KEY is not defined in environment variables"
  );
}

export const login = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as IUser & { _id: string }; // Explicitly cast user to include _id

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email is not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const userInTokensCollection = await Token.findOne({ email });
    if (userInTokensCollection) {
      await Token.findOneAndDelete({ email });
    }

    const newSession = await Session.create({
      uid: user._id,
    });

    const payload: JwtPayload = {
      id: user._id.toString(),
      sid: newSession._id.toString(),
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    const tokenRefresh = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "23d",
    });

    await User.findByIdAndUpdate(user._id, { token });

    const newToken = new Token({
      email: user.email,
      tokenRefresh,
    });
    await newToken.save();

    res.json({
      code: 200,
      message: "User login success",
      token,
      tokenRefresh,
      user: {
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
        movieIds: user.movieIds,
      },
    });
  }
);
