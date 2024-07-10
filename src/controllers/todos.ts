import { RequestHandler, Request, Response, NextFunction } from "express";
import { Todo, ITodo, schemas } from "../models/todos";
import ctrlWrapper from "../helpers/ctrlWrapper";
import HttpError from "../helpers/HttpError";
import mongoose, { Types } from "mongoose";
import { IUser } from "../models/user";
const TODOS: ITodo[] = [];

interface ITodoBody {
  name: string;
  favorite?: boolean;
  owner: string;
}

const validateTodo = (body: any) => {
  const { error } = schemas.addSchema.validate(body);
  if (error) {
    throw HttpError(400, error.details[0].message);
  }
};

const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, favorite, owner } = req.body as ITodoBody;
    const user = req.user as IUser;
    const ownerId = user._id;

    validateTodo(req.body);

    const newTodo = new Todo({
      name,
      favorite,
      owner: ownerId,
    });

    const savedTodo = await newTodo.save();
    if (!savedTodo) {
      throw HttpError(500, "Failed to create new todo");
    }

    res
      .status(201)
      .json({ message: "Created new todo", createdTodo: savedTodo });
  } catch (error: any) {
    next(HttpError(500, `Failed to create new todo: ${error.message}`));
  }
};

const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as IUser;
    const ownerId = user._id;
    console.log(user);

    const todos = await Todo.find({ owner: ownerId }).exec();
    if (!todos || todos.length === 0) {
      throw HttpError(404, "No todos found for this user");
    }

    // Convert owner field to string for consistent representation
    const todosWithStrings = todos.map((todo) => ({
      ...todo.toObject(),
      owner: todo.owner.toString(),
    }));

    res.status(200).json({ todos: todosWithStrings });
  } catch (error: any) {
    next(HttpError(500, `Failed to get todos: ${error.message}`));
  }
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
