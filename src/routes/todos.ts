import { Router } from "express";
import { isValidId } from "../middlewares/isValidId";
import { validateBody } from "../middlewares/validateBody";
import { schemas } from "../models/todos";

import {
  wrappedCreateTodo,
  wrappedGetTodos,
  wrappedUpdateTodos,
  wrappedDeleteTodos,
} from "../controllers/todos";
const router = Router();

router.post("/", validateBody(schemas.addSchema), wrappedCreateTodo);
router.get("/", wrappedGetTodos);
router.patch(
  "/:id",
  validateBody(schemas.addSchema),
  isValidId,
  wrappedUpdateTodos
);
router.delete("/:id", isValidId, wrappedDeleteTodos);

export default router;
