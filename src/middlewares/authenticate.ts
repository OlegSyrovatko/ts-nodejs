import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError";
import { User, Session, IUser } from "../models/user";
import dotenv from "dotenv";
import { SessionData } from "express-session";

dotenv.config();

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

interface JwtPayload {
  id: string;
  sid: string;
}

// Extending the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Extending the SessionData interface to include _id
declare module "express-session" {
  interface SessionData {
    _id: string;
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  try {
    if (bearer !== "Bearer") {
      return next(HttpError(401, "Not authorized"));
    }

    if (!token) {
      return next(HttpError(401, "No token"));
    }

    const { id, sid } = jwt.verify(token, SECRET_KEY) as JwtPayload;

    const user = await User.findById(id);
    const currentSession = await Session.findById(sid);

    if (!user || !user.token || !currentSession || token !== user.token) {
      return next(HttpError(401, "Unauthorized"));
    }

    req.user = user as IUser & Document;
    req.session._id = currentSession._id.toString(); // Ensure _id is a string

    next();
  } catch (error) {
    next(HttpError(401, "Invalid token"));
  }
};
