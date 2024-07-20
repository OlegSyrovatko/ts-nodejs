import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, Token, Session, IUser } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";

const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
  throw new Error(
    "SECRET_KEY or REFRESH_SECRET_KEY is not defined in environment variables"
  );
}

interface JwtPayload {
  id: string;
  sid: string;
}

export const refresh = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, tokenRefresh } = req.body as {
      email: string;
      tokenRefresh: string;
    };

    if (!email || !tokenRefresh) {
      return next(HttpError(400, "Error. Provide all required fields"));
    }

    const userRefresh = await Token.findOne({ email });

    if (!userRefresh) {
      return next(HttpError(401, "User email invalid or unauthorized"));
    }

    try {
      const validateTokenResult = jwt.verify(
        tokenRefresh,
        REFRESH_SECRET_KEY
      ) as JwtPayload;

      if (tokenRefresh !== userRefresh.tokenRefresh || !validateTokenResult) {
        await User.findOneAndUpdate({ email }, { token: "" });
        await Token.findOneAndDelete({ email });
        return next(HttpError(403, "Refresh token invalid or unauthorized"));
      }

      const user = (await User.findOne({ email })) as IUser & { _id: string };

      if (!user) {
        return next(HttpError(401, "User email invalid or unauthorized"));
      }

      const newSession = await Session.create({
        uid: user._id,
      });

      const payload: JwtPayload = {
        id: user._id.toString(),
        sid: newSession._id.toString(),
      };

      const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "5s" }); /// 23h
      const newTokenRefresh = jwt.sign(payload, REFRESH_SECRET_KEY, {
        expiresIn: "23d",
      });

      await User.findByIdAndUpdate(user._id, { token: newToken });
      await Token.findOneAndUpdate(
        { email },
        { tokenRefresh: newTokenRefresh }
      );

      res.status(200).json({
        code: 200,
        message: "Refresh success",
        token: newToken,
        tokenRefresh: newTokenRefresh,
      });
    } catch (error) {
      next(HttpError(401, "Invalid token"));
    }
  }
);
