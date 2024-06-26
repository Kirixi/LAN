import { Response, Request } from "express";
import { Post } from "../db/interfaces.js";
import { PostModel, CommentModel } from "../db/collections.js";
import { uploadFile, getImagePresignUrl } from "./s3-operations.js";
import mongoose from "mongoose";

const createPost = async (req: Request, res: Response) => {
	let url;
	try {
		const post = new PostModel<Post>({
			_id: new mongoose.Types.ObjectId(),
			content: req.body.content,
			link: req.body.link,
			username: req.body.username,
			parent_id: req.body.parent_id,
			createdAt: req.body.createdAt,
			comments: [],
			updatedAt: new Date(0),
			deleted: false,
		});

		if (req.body.link !== null) {
			url = await uploadFile(`${req.body.parent_id}/${req.body.link}`);
		}
		const response = await post.save();
		return res.status(200).json({ data: response, url: url });
	} catch (e: any) {
		return res.status(401).json(e.message);
	}
};

const getAllUserPost = async (req: Request, res: Response) => {
	try {
		const posts = await PostModel.find({ parent_id: req.params.id });
		for (const post of posts) {
			const comments = await CommentModel.find({ parent_id: post._id });
			post.comments = comments;
		}

		return res.status(200).json({ data: posts });
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

const getAllPost = async (req: Request, res: Response) => {
	try {
		const response = await PostModel.find();
		for (const post of response) {
			const comments = await CommentModel.find({ parent_id: post._id });
			post.comments = comments;
		}

		for (const post of response) {
			if (post.link !== null) {
				const imageName = post.parent_id + "/" + post.link;
				const url = await getImagePresignUrl(imageName);
				post.link = url;
			}
		}
		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(401).json(e.message);
	}
};

const updatePost = async (req: Request, res: Response) => {
	try {
		const response = await PostModel.updateOne(
			{ _id: req.params.id },
			{ $set: { content: req.body.content, updatedAt: req.body.updatedAt } }
		);
		return res.status(200).json({ message: "Post Successfully Updated!" });
	} catch (e: any) {
		return res.status(401).json(e.message);
	}
};

const deletePost = async (req: Request, res: Response) => {
	try {
		const response = await PostModel.deleteOne({ _id: req.params.id });
		return res.status(200).json({ message: "Post Successfully Deleted!" });
	} catch (e: any) {
		return res.status(401).json(e.message);
	}
};

export default { createPost, getAllPost, getAllUserPost, updatePost, deletePost };
