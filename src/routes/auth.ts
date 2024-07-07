import express from "express";
import { Request, Response, NextFunction } from "express";

import * as ctrl from "../controllers/auth";

import { validateBody } from "../middlewares/validateBody";
import { authenticate } from "../middlewares/authenticate";
import { schemas } from "../models/user";
const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  (req: Request, res: Response, next: NextFunction) =>
    ctrl.register(req, res, next)
);

router.get(
  "/verify/:verificationToken",
  (req: Request, res: Response, next: NextFunction) =>
    ctrl.verifyEmail(req, res, next)
);

router.get(
  "/verify",
  validateBody(schemas.emailSchema),
  (req: Request, res: Response, next: NextFunction) =>
    ctrl.resendVerifyEmail(req, res, next)
);

// router.post(
//   "/login",
//   validateBody(schemas.loginSchema),
//   (req: Request, res: Response, next: NextFunction) =>
//     ctrl.login(req, res, next)
// );

// router.post(
//   "/refresh",
//   validateBody(schemas.refreshSchema),
//   (req: Request, res: Response, next: NextFunction) =>
//     ctrl.refreshUser(req, res, next)
// );

// router.get(
//   "/current",
//   authenticate,
//   (req: Request, res: Response, next: NextFunction) =>
//     ctrl.getCurrent(req, res, next)
// );

// router.post(
//   "/logout",
//   authenticate,
//   (req: Request, res: Response, next: NextFunction) =>
//     ctrl.logout(req, res, next)
// );

export default router;
