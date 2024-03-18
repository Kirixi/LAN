import { client } from "./connect.js";
import { Schema, model } from "mongoose";

import { User, Post } from "./interfaces.js";

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

const postSchema = new Schema<Post>({
  content: { type: String, required: true },
  link: { type: String, required: false },
  parent_id: { type: String, required: true },

})

//Exports the model with a singleton pattern
export const UserModel = model("User", userSchema);
export const PostModel = model("Post", postSchema);
