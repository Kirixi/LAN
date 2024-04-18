import { Response, Request } from "express";
import { Post } from "../db/interfaces.js";
import { PostModel } from "../db/collections.js";
import mongoose from "mongoose";


const createPost = async (req: Request, res: Response) => {

    try {
        const post = new PostModel<Post>({
            _id: new mongoose.Types.ObjectId(),
            content: req.body.content,
            link: req.body.link,
            username: req.body.username,
            parent_id: req.body.parent_id,
            createdAt: req.body.createdAt,
            updatedAt: new Date(0),
            deleted: false,
        })

        const response = await post.save();
        return res.status(200).json(response);

    } catch (e: any) {
        return res.status(401).json(e.message);
    }

}

const getAllUserPost = async (req: Request, res: Response) => {

    try {
        const response = await PostModel.find({ parent_id: req.params.id })
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }

}

const getAllPost = async (req: Request, res: Response) => {

    try {
        const response = await PostModel.find();
        return res.status(200).json(response);
    } catch (e: any) {
        return res.status(401).json(e.message);
    }
}

const updatePost = async (req: Request, res: Response) => {

    try {
        const response = await PostModel.updateOne({ _id: req.params.id }, { $set: { content: req.body.content } });
        return res.status(200).json({ message: "Post Successfully Updated!" })
    } catch (e: any) {
        return res.status(401).json(e.message);
    }
}

const deletePost = async (req: Request, res: Response) => {

    try {
        const response = await PostModel.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Post Successfully Deleted!" })
    } catch (e: any) {
        return res.status(401).json(e.message);
    }
}

export default { createPost, getAllPost, getAllUserPost, updatePost, deletePost }