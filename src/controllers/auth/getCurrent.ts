import { Request, Response, NextFunction } from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import jwt from "jsonwebtoken";
import { IUser, User, Token, Session } from "../../models/user";
import HttpError from "../../helpers/HttpError";

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

interface JwtPayload {
  id: string;
  sid: string;
}

export const getCurrent = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return next(HttpError(401, "No token provided"));
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return next(HttpError(401, "Unauthorized"));
      }

      let decoded;
      try {
        decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
      } catch (err) {
        return next(HttpError(401, "Invalid token"));
      }

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(HttpError(404, "User not found"));
      }

      const tokenDoc = await Token.findOne({ email: user.email });

      if (!tokenDoc) {
        return next(HttpError(401, "Refresh token not found"));
      }

      res.json({
        token: user.token,
        tokenRefresh: tokenDoc.tokenRefresh,
        user: {
          name: user.name,
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
          movieIds: user.movieIds,
        },
      });
    } catch (error) {
      console.error("Error in getCurrent:", error);
      next(HttpError(500, "Internal Server Error"));
    }
  }
);
