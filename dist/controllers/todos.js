"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodos = exports.updateTodos = exports.getTodos = exports.createTodo = void 0;
const todos_1 = require("../models/todos");
const TODOS = [];
const createTodo = async (req, res, next) => {
    try {
        const { name, favorite = false } = req.body;
        const newTodo = new todos_1.Todo({
            id: Math.random().toString(),
            name,
            favorite,
        });
        await newTodo.save();
        res.status(201).json({ message: "Created new todo", createTodo: newTodo });
    }
    catch (error) {
        next(error);
    }
};
exports.createTodo = createTodo;
const getTodos = async (req, res, next) => {
    try {
        const todos = await todos_1.Todo.find();
        res.status(200).json({ todos });
    }
    catch (error) {
        next(error);
    }
};
exports.getTodos = getTodos;
const updateTodos = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, favorite } = req.body;
        const todo = await todos_1.Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Could not find todo" });
        }
        todo.name = name;
        todo.favorite = favorite !== null && favorite !== void 0 ? favorite : todo.favorite;
        await todo.save();
        res.status(200).json({ message: "Updated todo", updateTodo: todo });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTodos = updateTodos;
const deleteTodos = async (req, res, next) => {
    try {
        const { id } = req.params;
        const todo = await todos_1.Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ message: "Could not find todo" });
        }
        res.status(200).json({ message: "Deleted todo" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTodos = deleteTodos;
