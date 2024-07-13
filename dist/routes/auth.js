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
const express_1 = __importDefault(require("express"));
const ctrl = __importStar(require("../controllers/auth"));
const validateBody_1 = require("../middlewares/validateBody");
const authenticate_1 = require("../middlewares/authenticate");
const upload_1 = require("../middlewares/upload");
const user_1 = require("../models/user");
const router = express_1.default.Router();
router.post("/register", (0, validateBody_1.validateBody)(user_1.schemas.registerSchema), (req, res, next) => ctrl.register(req, res, next));
router.get("/verify/:verificationToken", (req, res, next) => ctrl.verifyEmail(req, res, next));
router.get("/verify", (0, validateBody_1.validateBody)(user_1.schemas.emailSchema), (req, res, next) => ctrl.resendVerifyEmail(req, res, next));
router.post("/login", (0, validateBody_1.validateBody)(user_1.schemas.loginSchema), (req, res, next) => ctrl.login(req, res, next));
router.post("/refresh", (0, validateBody_1.validateBody)(user_1.schemas.refreshSchema), (req, res, next) => ctrl.refresh(req, res, next));
router.get("/current", authenticate_1.authenticate, (req, res, next) => ctrl.getCurrent(req, res, next));
router.patch("/subscription", authenticate_1.authenticate, (0, validateBody_1.validateBody)(user_1.schemas.updateSubscription), ctrl.updateSubscription);
router.patch("/avatar", authenticate_1.authenticate, upload_1.upload.single("avatar"), ctrl.updateAvatar);
router.patch("/add-movie", authenticate_1.authenticate, (0, validateBody_1.validateBody)(user_1.schemas.movieIdSchema), ctrl.addMovie);
router.patch("/remove-movie", authenticate_1.authenticate, (0, validateBody_1.validateBody)(user_1.schemas.movieIdSchema), ctrl.removeMovie);
router.post("/logout", authenticate_1.authenticate, (req, res, next) => ctrl.logout(req, res, next));
exports.default = router;
