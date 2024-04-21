import { Response, Request } from "express";
import { Comment } from "../db/interfaces.js";
import { CommentModel } from "../db/collections.js";
import mongoose from "mongoose";

const createComment = async (req: Request, res: Response) => {

    try {
        const comment = new CommentModel<Comment>({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            content: req.body.content,
            createdAt: req.body.createdAt,
            updatedAt: new Date(0),
            parent_id: req.body.parent_id,
            deleted: false,
        })

        const response = await comment.save();

        return res.status(200).json({ data: response })
    } catch (e: any) {
        console.log(e.message)
        return res.status(401).json({ message: e.message })
    }

}

const getUserComments = async (req: Request, res: Response) => {

    try {
        const response = await CommentModel.find({ userEmail: req.params.email });
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

const getPostComments = async (req: Request, res: Response) => {
    try {
        const response = await CommentModel.find({ parentId: req.params.parentId });
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

const updateComment = async (req: Request, res: Response) => {
    try {
        const response = await CommentModel.updateOne({ _id: req.params.id }, { $set: { content: req.body.content } })
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const response = await CommentModel.deleteOne({ _id: req.params.id })
        return res.status(200).json({ data: response })
    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

export default { createComment, getUserComments, getPostComments, updateComment, deleteComment };