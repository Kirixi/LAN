import { Response, Request } from "express";
import { Comment } from "../db/interfaces.js";
import { CommentModel } from "../db/collections.js";
import mongoose from "mongoose";

const createComment = async (req: Request, res: Response) => {

    try {

        const comment = new CommentModel({
            _id: new mongoose.Types.ObjectId(),
            userEmail: req.body.email,
            content: req.body.content,
            link: req.body.link,
            createdAt: req.body.createdAt,
        })

        const response = await comment.save();

        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }

}

const getUserComments = async (req: Request, res: Response) => {

    try {
        const response = CommentModel.find({ _id: req.params.id });
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

const getPostComments = async (req: Request, res: Response) => {
    try {
        const response = CommentModel.find({ parentId: req.params.parentId });
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

const updateComment = async (req: Request, res: Response) => {
    try {
        const response = CommentModel.updateOne({ _id: req.body.id }, { $set: { content: req.body.content } })
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const response = CommentModel.deleteOne({ _id: req.params.id })
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

export default { createComment, getUserComments, getPostComments, updateComment, deleteComment };