import { client } from "./connect.js";
import { Schema, model } from "mongoose";

import { User, Post, Comment } from "./interfaces.js";

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

const postSchema = new Schema<Post>({
  content: { type: String, required: true },
  link: { type: String, required: false },
  parent_id: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

const commentSchema = new Schema<Comment>({
  userEmail: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String, required: false },
  createdAt: { type: Date, required: true },
  parentId: { type: String, required: true },
})

//Exports the model with a singleton pattern
export const UserModel = model("User", userSchema);
export const PostModel = model("Post", postSchema);
export const CommentModel = model("Comment", commentSchema);
