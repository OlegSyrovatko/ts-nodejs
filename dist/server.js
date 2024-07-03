"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const { DB_HOST, PORT = 3000 } = process.env;
mongoose_1.default.set("strictQuery", true);
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(DB_HOST);
        console.log("Database connection successful");
    }
    catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};
const startServer = () => {
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}.`);
    });
};
const runServer = async () => {
    await connectDatabase();
    startServer();
};
runServer();
