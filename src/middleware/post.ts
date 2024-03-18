import { Response, Request } from "express";
import { Post } from "../db/interfaces.js";
import { PostModel } from "../db/collections.js";
import mongoose from "mongoose";


const createPost = async (req: Request, res: Response) => {

    try {

        const post = new PostModel({
            _id: new mongoose.Types.ObjectId(),
            content: req.body.content,
            link: req.body.content,
            parent_id: req.body.parent_id,
        })

        const response = await post.save();
        return res.status(200).json(response);

    } catch (e: any) {
        return res.status(401).json(e.message);
    }



}

export default { createPost }