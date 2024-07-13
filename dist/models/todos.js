"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.Todo = void 0;
const mongoose_1 = require("mongoose");
const handleMongooseError_1 = require("../helpers/handleMongooseError");
const Joi = require("joi");
const todoSchema = new mongoose_1.Schema({
    // id: {
    //   type: String,
    //   required: [true, "Set id for todo"],
    // },
    name: {
        type: String,
        required: [true, "Set name for todo"],
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { versionKey: false, timestamps: true });
todoSchema.post("save", function (error, doc, next) {
    (0, handleMongooseError_1.handleMongooseError)(error, doc, next);
});
const addSchema = Joi.object({
    // id: Joi.string().max(30).required(),
    name: Joi.string().max(30).required(),
    // favorite: Joi.boolean(),
});
// const updateFavoriteSchema = Joi.object({ favorite: Joi.boolean().required() });
const schemas = {
    addSchema,
    // updateFavoriteSchema,
};
exports.schemas = schemas;
const Todo = (0, mongoose_1.model)("todo", todoSchema);
exports.Todo = Todo;
