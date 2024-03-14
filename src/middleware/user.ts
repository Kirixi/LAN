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
      name: req.body.username,
    });

    const response = await user.save();

    return res.status(200).json(response);
  } catch (e: any) {
    console.log(e);
    return e.message;
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.findById(req.params.id);
    return res.status(200).json(response);
  } catch (e: any) {
    console.log(e);
    return e.message;
  }
};

const getUsernamebyEmail = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.findOne({ email: req.params.email });
    return res.status(200).json(response);
  } catch (e: any) {
    console.log(e);
    return e.message;
  }
};

const getUserbyUsername = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.findOne({ name: req.params.username });
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
  } catch (e: any) {
    console.log(e);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.findOne({ email: req.body.email });
    const passwordHash = await argon2.hash(req.body.password);
    const userPassword: string | undefined = response?.password;

    if (userPassword) {
      if (await argon2.verify(passwordHash, userPassword)) {
        return res.status(200).json(response);
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      return res.status(401).json({ message: "User is not found" });
    }
  } catch (e: any) {
    console.log(e);
    return e.message;
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  getUsernamebyEmail,
  getUserbyUsername,
  login,
};
