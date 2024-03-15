import { client } from "./connect.js";
import { Schema, model } from "mongoose";

import { User } from "./interfaces.js";

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

export const UserModel = model("User", userSchema);
