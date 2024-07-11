import mongoose, { Schema, Document, Model, model, Types } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError";
import Joi from "joi";

export interface IToken extends Document {
  email: string;
  tokenRefresh: string;
}

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  subscription: "starter" | "pro" | "business";
  token?: string;
  password: string;
  avatarURL: string;
  verify: boolean;
  verificationToken: string;
  movieIds: string[];
}

interface ISession extends Document {
  _id: string;
  uid: mongoose.Types.ObjectId;
}

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const tokenRefreshSchema = new Schema<IToken>(
  {
    email: {
      type: String,
      required: [true, "userId field must be filled in correctly"],
    },
    tokenRefresh: {
      type: String,
      required: [true, "tokenRefresh field must be filled in correctly"],
    },
  },
  { versionKey: false, timestamps: true }
);

tokenRefreshSchema.post(
  "save",
  function (error: any, doc: any, next: (err?: any) => void) {
    handleMongooseError(error, doc, next);
  }
);

const Token: Model<IToken> = model<IToken>("Token", tokenRefreshSchema);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Set name"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    avatarURL: {
      type: String,
      required: [true, "avatar is required"],
      unique: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    movieIds: {
      type: [String],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post(
  "save",
  function (error: any, doc: any, next: (err?: any) => void) {
    handleMongooseError(error, doc, next);
  }
);

const User: Model<IUser> = model<IUser>("User", userSchema);

const sessionSchema = new Schema<ISession>({
  uid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Session: Model<ISession> = mongoose.model<ISession>(
  "Session",
  sessionSchema
);

// Joi schemas for validation
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

const updateSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const refreshSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  tokenRefresh: Joi.string().required(),
});

const movieIdSchema = Joi.object({
  movieId: Joi.string().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSubscription,
  emailSchema,
  refreshSchema,
  movieIdSchema,
};

export { Token, User, IUser, Session, ISession, EmailData, schemas };
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
