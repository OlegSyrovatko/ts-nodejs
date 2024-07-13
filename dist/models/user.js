"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.Session = exports.User = exports.Token = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const handleMongooseError_1 = require("../helpers/handleMongooseError");
const joi_1 = __importDefault(require("joi"));
const tokenRefreshSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "userId field must be filled in correctly"],
    },
    tokenRefresh: {
        type: String,
        required: [true, "tokenRefresh field must be filled in correctly"],
    },
}, { versionKey: false, timestamps: true });
tokenRefreshSchema.post("save", function (error, doc, next) {
    (0, handleMongooseError_1.handleMongooseError)(error, doc, next);
});
const Token = (0, mongoose_1.model)("Token", tokenRefreshSchema);
exports.Token = Token;
const userSchema = new mongoose_1.Schema({
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
}, { versionKey: false, timestamps: true });
userSchema.post("save", function (error, doc, next) {
    (0, handleMongooseError_1.handleMongooseError)(error, doc, next);
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.User = User;
const sessionSchema = new mongoose_1.Schema({
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
});
const Session = mongoose_1.default.model("Session", sessionSchema);
exports.Session = Session;
// Joi schemas for validation
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    password: joi_1.default.string().min(6).required(),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    password: joi_1.default.string().min(6).required(),
});
const emailSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
});
const updateSubscription = joi_1.default.object({
    subscription: joi_1.default.string().valid("starter", "pro", "business").required(),
});
const refreshSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    tokenRefresh: joi_1.default.string().required(),
});
const movieIdSchema = joi_1.default.object({
    movieId: joi_1.default.string().required(),
});
const schemas = {
    registerSchema,
    loginSchema,
    updateSubscription,
    emailSchema,
    refreshSchema,
    movieIdSchema,
};
exports.schemas = schemas;
