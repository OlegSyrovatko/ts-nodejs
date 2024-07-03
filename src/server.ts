import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);

const connectDatabase = async () => {
  try {
    await mongoose.connect(DB_HOST!);
    console.log("Database connection successful!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    process.exit(1);
  }
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
  });
};

const runServer = async () => {
  await connectDatabase();
  startServer();
};

runServer();
