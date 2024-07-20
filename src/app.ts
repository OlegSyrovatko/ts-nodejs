import express, { Request, Response, NextFunction } from "express";
import todoRoutes from "./routes/todos";
import authRoutes from "./routes/auth";
import { json } from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import path from "path";

dotenv.config();

const { SESSION_SECRET_WORD, SESSION_KEY, DB_HOST } = process.env;
if (!SESSION_SECRET_WORD || !SESSION_KEY || !DB_HOST) {
  throw new Error("Required environment variables are missing");
}

const app = express();

app.use(json());
app.use(express.static(path.join(__dirname, "../public")));
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://olegsyrovatko.github.io",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: SESSION_SECRET_WORD,
    name: SESSION_KEY,
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: DB_HOST,
      autoRemove: "native",
    }),
  })
);

app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
