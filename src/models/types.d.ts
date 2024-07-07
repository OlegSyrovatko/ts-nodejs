import { Request } from "express";
import { Document } from "mongoose";
import { IUser } from "./user";

interface SessionData {
  _id: string;
}

declare module "express-serve-static-core" {
  interface Request {
    session?: SessionData;
    user?: IUser & Document;
  }
}
