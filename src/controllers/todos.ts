import { RequestHandler, Request, Response, NextFunction } from "express";
import { Todo, ITodo } from "../models/todos";
import ctrlWrapper from "../helpers/ctrlWrapper"; // Adjust the import path as necessary
import HttpError from "../helpers/HttpError";

const TODOS: ITodo[] = [];

interface ITodoBody {
  name: string;
  favorite?: boolean;
}

const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, favorite = false } = req.body as ITodoBody;

  const newTodo = new Todo({
    // id: Math.random().toString(),
    name,
    favorite,
  });

  const savedTodo = await newTodo.save();
  if (!savedTodo) {
    throw HttpError(500, "Failed to create new todo");
  }
  res.status(201).json({ message: "Created new todo", createTodo: savedTodo });
};

const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const todos = await Todo.find();
  if (!todos) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ todos });
};

const updateTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { name, favorite } = req.body as ITodoBody;

  const todo = await Todo.findById(id);
  if (!todo) {
    throw HttpError(404, "Not found");
  }

  todo.name = name;
  todo.favorite = favorite ?? todo.favorite;

  await todo.save();

  res.status(200).json({ message: "Updated todo", updateTodo: todo });
};

const deleteTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    throw HttpError(404);
  }

  res.status(200).json({ message: "Deleted todo" });
};

export const wrappedCreateTodo = ctrlWrapper(createTodo);
export const wrappedGetTodos = ctrlWrapper(getTodos);
export const wrappedUpdateTodos = ctrlWrapper(updateTodos);
export const wrappedDeleteTodos = ctrlWrapper(deleteTodos);
