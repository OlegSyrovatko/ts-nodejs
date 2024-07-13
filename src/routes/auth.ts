import express from "express";
import { Request, Response, NextFunction } from "express";

import * as ctrl from "../controllers/auth";

import { validateBody } from "../middlewares/validateBody";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/upload";
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

router.post(
  "/login",
  validateBody(schemas.loginSchema),
  (req: Request, res: Response, next: NextFunction) =>
    ctrl.login(req, res, next)
);

router.post(
  "/refresh",
  validateBody(schemas.refreshSchema),
  (req: Request, res: Response, next: NextFunction) =>
    ctrl.refresh(req, res, next)
);

router.get(
  "/current",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    ctrl.getCurrent(req, res, next)
);

router.patch(
  "/subscription",
  authenticate,
  validateBody(schemas.updateSubscription),
  ctrl.updateSubscription
);

router.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

router.delete("/avatar", authenticate, ctrl.deleteAvatar);

router.patch(
  "/add-movie",
  authenticate,
  validateBody(schemas.movieIdSchema),
  ctrl.addMovie
);

router.patch(
  "/remove-movie",
  authenticate,
  validateBody(schemas.movieIdSchema),
  ctrl.removeMovie
);

router.post(
  "/logout",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    ctrl.logout(req, res, next)
);

export default router;
