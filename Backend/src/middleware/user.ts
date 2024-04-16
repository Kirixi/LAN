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
      username: req.body.username,
      joined: req.body.joined,
    });

    const savedUser = await user.save();
    
    const response = {
      _id: savedUser._id,
      email: savedUser.email,
      username: savedUser.username,
      joined: savedUser.joined,
    }
    

    return res.status(200).json(response);
  } catch (e: any) {
    console.log(e);
    return res.status(401).json({ message: e.message});

  }
};

const verifyEmail = async (req: Request, res:Response) => {
  try {
    const response = await UserModel.findOne({ email: req.params.email });

    if(response == null ){
      throw new Error("not found");
    }
    return res.status(200).json({ verified: false })
  } catch (e: any) {
    return res.status(200).json({ verified: true});
  }

}

const getUserById = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.findById(req.params.id, {password: 0});
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
    const response = await UserModel.find({}, { password: 0 });
    return res.status(200).json(response);
  } catch (e: any) {
    console.log(e);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.findOne({ email: req.body.email }, { password: 0 });
    const passwordHash = req.body.password;
    const userPassword: string | undefined = response?.password;

    if (userPassword) {
      if (await argon2.verify(userPassword, passwordHash)) {
        return res.status(200).json({ message: "Welcome!", data: response });
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

const updateUsername = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.updateOne(
      { _id: req.params.id },
      { $set: { username: req.body.username } }
    );
    return res.status(200).json(response);
  } catch (e: any) {
    console.log(e.message);
    return res.status(401).json({ message: e.message });
  }
};

const updateEmail = async (req: Request, res: Response) => {
  try {
    if (!req.body.email) {
      throw new Error("Email is required!");
    }
    const response = await UserModel.updateOne(
      { _id: req.params.id },
      { $set: { email: req.body.email } }
    );
    return res.status(200).json(response);
  } catch (e: any) {
    return res.status(401).json(e.message);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.deleteOne({ _id: req.params.id });
    return res.status(200).json(response);
  } catch (e: any) {
    return res.status(401).json(e.message);
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  getUsernamebyEmail,
  getUserbyUsername,
  login,
  updateUsername,
  updateEmail,
  deleteUser,
  verifyEmail,
};
