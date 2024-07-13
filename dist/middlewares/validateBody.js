"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const HttpError_1 = __importDefault(require("../helpers/HttpError"));
const validateBody = (schema) => {
    const func = (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            next((0, HttpError_1.default)(400, "missing fields"));
            return;
        }
        const { error } = schema.validate(req.body);
        if (error) {
            next((0, HttpError_1.default)(400, error.message));
            return;
        }
        next();
    };
    return func;
};
exports.validateBody = validateBody;
