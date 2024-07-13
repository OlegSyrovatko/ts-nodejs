"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpError_1 = __importDefault(require("../helpers/HttpError"));
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SECRET_KEY } = process.env;
if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
}
const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    try {
        if (bearer !== "Bearer") {
            return next((0, HttpError_1.default)(401, "Not authorized"));
        }
        if (!token) {
            return next((0, HttpError_1.default)(401, "No token"));
        }
        const { id, sid } = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        const user = await user_1.User.findById(id);
        const currentSession = await user_1.Session.findById(sid);
        if (!user || !user.token || !currentSession || token !== user.token) {
            return next((0, HttpError_1.default)(401, "Unauthorized"));
        }
        req.user = user;
        req.session._id = currentSession._id.toString(); // Ensure _id is a string
        next();
    }
    catch (error) {
        next((0, HttpError_1.default)(401, "Invalid token"));
    }
};
exports.authenticate = authenticate;
