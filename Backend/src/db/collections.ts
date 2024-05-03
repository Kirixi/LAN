import { client } from "./connect.js";
import { Schema, model } from "mongoose";

import { User, Post, Comment, Follows } from "./interfaces.js";

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  joined: { type: String, required: true },
  status: { type: String, required: false},
});

const postSchema = new Schema<Post>({
  content: { type: String, required: true },
  link: { type: String, required: false },
  username: { type: String, required: true },
  parent_id: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  comments: {type: [Object], required: true},
  deleted: { type: Boolean, required: true },
});

const commentSchema = new Schema<Comment>({
  username: { type: String, required: true },
  user_id: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  parent_id: { type: String, required: true },
  deleted: { type: Boolean, required: true },
});

const followSchema = new Schema<Follows>({
  user_id: { type: String, required: true },
  follower_id: { type: String, required: true },
  follower_username: { type: String, required: true },
})

//Exports the model with a singleton pattern
export const UserModel = model("User", userSchema);
export const PostModel = model("Post", postSchema);
export const CommentModel = model("Comment", commentSchema);
export const FollowModel = model("Follows", followSchema);
