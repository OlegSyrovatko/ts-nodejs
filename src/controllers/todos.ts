import { RequestHandler } from "express";
import { Todo, ITodo } from "../models/todos";

const TODOS: ITodo[] = [];

interface ITodoBody {
  name: string;
  favorite?: boolean;
}

export const createTodo: RequestHandler = async (req, res, next) => {
  try {
    const { name, favorite = false } = req.body as ITodoBody;

    const newTodo = new Todo({
      id: Math.random().toString(),
      name,
      favorite,
    });

    await newTodo.save();

    res.status(201).json({ message: "Created new todo", createTodo: newTodo });
  } catch (error) {
    next(error);
  }
};

export const getTodos: RequestHandler = async (req, res, next) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({ todos });
  } catch (error) {
    next(error);
  }
};

export const updateTodos: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, favorite } = req.body as ITodoBody;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Could not find todo" });
    }

    todo.name = name;
    todo.favorite = favorite ?? todo.favorite;

    await todo.save();

    res.status(200).json({ message: "Updated todo", updateTodo: todo });
  } catch (error) {
    next(error);
  }
};

export const deleteTodos: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: "Could not find todo" });
    }

    res.status(200).json({ message: "Deleted todo" });
  } catch (error) {
    next(error);
  }
};
