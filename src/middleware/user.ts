import { Response, Request } from "express";
import { User } from "../db/interfaces.js";
import { UserModel } from "../db/collections.js";
import mongoose from "mongoose";
import * as argon2 from "argon2";

const createUser = async (req: Request, res: Response) => {
  try {
    const passwordHash = await argon2.hash(req.body.password);
    const user = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: passwordHash,
      name: req.body.email,
    });

    const response = await user.save();

    return res.status(200).json(response);
  } catch (e: any) {
    console.log(e);
    return e.message;
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.find();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
};

export default { createUser, getAllUsers };
