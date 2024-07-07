import { Router } from "express";
import { isValidId } from "../middlewares/isValidId";
import { validateBody } from "../middlewares/validateBody";
import { authenticate } from "../middlewares/authenticate";

import { schemas } from "../models/todos";

import {
  wrappedCreateTodo,
  wrappedGetTodos,
  wrappedUpdateTodos,
  wrappedDeleteTodos,
} from "../controllers/todos";
const router = Router();

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  wrappedCreateTodo
);
router.get("/", authenticate, wrappedGetTodos);
router.patch(
  "/:id",
  authenticate,
  validateBody(schemas.addSchema),
  isValidId,
  wrappedUpdateTodos
);
router.delete("/:id", authenticate, isValidId, wrappedDeleteTodos);

export default router;
