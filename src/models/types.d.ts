import { Session, SessionData } from "express-session";
import { IUser } from "./models/user";

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: string };
      session?: Session & Partial<SessionData> & { _id?: string };
    }
  }
}
