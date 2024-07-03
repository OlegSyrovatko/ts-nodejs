// export class Todo {
//   constructor(public id: string, public text: string) {}
// }

import { Schema, model, Document } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError";
const Joi = require("joi");

export interface ITodo extends Document {
  id: string;
  name: string;
  favorite?: boolean;
}

const todoSchema = new Schema<ITodo>(
  {
    id: {
      type: String,
      required: [true, "Set name for todo"],
    },
    name: {
      type: String,
      required: [true, "Set name for todo"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    // owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: "user",
    // },
  },
  { versionKey: false, timestamps: true }
);

type HookNextFunction = (err?: any) => void;

todoSchema.post(
  "save",
  function (error: any, doc: any, next: (err?: any) => void) {
    handleMongooseError(error, doc, next);
  }
);

const addSchema = Joi.object({
  id: Joi.string().max(30).required(),
  name: Joi.string().max(30).required(),
  // favorite: Joi.boolean(),
});

// const updateFavoriteSchema = Joi.object({ favorite: Joi.boolean().required() });

const schemas = {
  addSchema,
  // updateFavoriteSchema,
};
const Todo = model<ITodo>("todo", todoSchema);

export { Todo, schemas };
