import { Router } from "express";
// const express = require("express");
// const Router = express.Router;
import {
  createTodo,
  getTodos,
  updateTodos,
  deleteTodos,
} from "../controllers/todos";
const router = Router();

router.post("/", createTodo);
router.get("/", getTodos);
router.patch("/:id", updateTodos);
router.delete("/:id", deleteTodos);

export default router;
