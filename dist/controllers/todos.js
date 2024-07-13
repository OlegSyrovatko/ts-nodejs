"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrappedDeleteTodos = exports.wrappedUpdateTodos = exports.wrappedGetTodos = exports.wrappedCreateTodo = void 0;
const todos_1 = require("../models/todos");
const ctrlWrapper_1 = __importDefault(require("../helpers/ctrlWrapper"));
const HttpError_1 = __importDefault(require("../helpers/HttpError"));
const TODOS = [];
const validateTodo = (body) => {
    const { error } = todos_1.schemas.addSchema.validate(body);
    if (error) {
        throw (0, HttpError_1.default)(400, error.details[0].message);
    }
};
const createTodo = async (req, res, next) => {
    try {
        const { name, favorite, owner } = req.body;
        const user = req.user;
        const ownerId = user._id;
        validateTodo(req.body);
        const newTodo = new todos_1.Todo({
            name,
            favorite,
            owner: ownerId,
        });
        const savedTodo = await newTodo.save();
        if (!savedTodo) {
            throw (0, HttpError_1.default)(500, "Failed to create new todo");
        }
        res
            .status(201)
            .json({ message: "Created new todo", createdTodo: savedTodo });
    }
    catch (error) {
        next((0, HttpError_1.default)(500, `Failed to create new todo: ${error.message}`));
    }
};
const getTodos = async (req, res, next) => {
    try {
        const user = req.user;
        const ownerId = user._id;
        console.log(user);
        const todos = await todos_1.Todo.find({ owner: ownerId }).exec();
        if (!todos || todos.length === 0) {
            throw (0, HttpError_1.default)(404, "No todos found for this user");
        }
        // Convert owner field to string for consistent representation
        const todosWithStrings = todos.map((todo) => ({
            ...todo.toObject(),
            owner: todo.owner.toString(),
        }));
        res.status(200).json({ todos: todosWithStrings });
    }
    catch (error) {
        next((0, HttpError_1.default)(500, `Failed to get todos: ${error.message}`));
    }
};
const updateTodos = async (req, res, next) => {
    const { id } = req.params;
    const { name, favorite } = req.body;
    const todo = await todos_1.Todo.findById(id);
    if (!todo) {
        throw (0, HttpError_1.default)(404, "Not found");
    }
    todo.name = name;
    todo.favorite = favorite !== null && favorite !== void 0 ? favorite : todo.favorite;
    await todo.save();
    res.status(200).json({ message: "Updated todo", updateTodo: todo });
};
const deleteTodos = async (req, res, next) => {
    const { id } = req.params;
    const todo = await todos_1.Todo.findByIdAndDelete(id);
    if (!todo) {
        throw (0, HttpError_1.default)(404);
    }
    res.status(200).json({ message: "Deleted todo" });
};
exports.wrappedCreateTodo = (0, ctrlWrapper_1.default)(createTodo);
exports.wrappedGetTodos = (0, ctrlWrapper_1.default)(getTodos);
exports.wrappedUpdateTodos = (0, ctrlWrapper_1.default)(updateTodos);
exports.wrappedDeleteTodos = (0, ctrlWrapper_1.default)(deleteTodos);
