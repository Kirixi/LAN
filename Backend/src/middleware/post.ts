import { Response, Request } from "express";
import { Post } from "../db/interfaces.js";
import { PostModel, CommentModel } from "../db/collections.js";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";
import { createItem, deleteItem, updateItem, gsiSearch, scanTable } from "./DynamoDB/Dynamodb-api.js";

const TABLENAME = "Post-dev";
const TABLE_COM = "Comment-dev";

const createPost = async (req: Request, res: Response) => {
	try {
		const bodyValidation = Joi.object({
			content: Joi.string().required().messages({
				"any.required": "Content is required.",
			}),
			parent_id: Joi.string().required().messages({
				"any.required": "Parent id is required.",
			}),
			username: Joi.string().required().messages({
				"any.required": "Username is required.",
			}),
			link: Joi.string().messages({
				"any.required": "Has to be a string",
			}),
			createdAt: Joi.string().required().messages({
				"any.required": "Created date is required.",
			}),
		});

		const { error } = bodyValidation.validate(req.body, { abortEarly: false });
		if (error) {
			const validationErrors = error.details[0];

			throw new Error("Validation Error: " + validationErrors.message);
		}

		const post: Post = {
			_id: uuidv4(),
			content: req.body.content,
			link: req.body.link,
			username: req.body.username,
			parent_id: req.body.parent_id,
			createdAt: req.body.createdAt,
			comments: [],
			updatedAt: new Date(0).toISOString(),
			deleted: false,
		};

		const response = await createItem(post, TABLENAME);

		return res.status(200).json({ status: response, data: post });
	} catch (e: any) {
		console.log(e.message);
		return res.status(401).json(e.message);
	}
};

const getAllUserPost = async (req: Request, res: Response) => {
	try {
		const queryExpression = "parent_id = :parent_id";
		const params = {
			":parent_id": req.params.id,
		};
		const posts = await gsiSearch(params, TABLENAME, queryExpression, "parent_id-createdAt-index");
		// if (posts) {
		// 	const queryExpressionCom = "parent_id = :parent_id";
		// 	const paramsCom = {
		// 		":parent_id": req.params.id,
		// 	};
		// 	for (const post of posts) {
		// 		const comments = await gsiSearch(paramsCom, TABLE_COM, queryExpressionCom, "");
		// 		post.comments = comments;
		// 	}
		// }

		return res.status(200).json({ data: posts });
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

const getAllPost = async (req: Request, res: Response) => {
	try {
		const response = await scanTable(TABLENAME);
		// for (const post of response) {
		// 	const comments = await CommentModel.find({ parent_id: post._id });
		// 	post.comments = comments;
		// }
		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(401).json(e.message);
	}
};

const updatePost = async (req: Request, res: Response) => {
	try {
		const date = new Date();
		const bodyValidation = Joi.object({
			content: Joi.string().required().messages({
				"any.required": "Content is required.",
			}),
		});

		const { error } = bodyValidation.validate(req.body, { abortEarly: false });
		if (error) {
			const validationErrors = error.details[0];
			throw new Error(validationErrors.message);
		}

		const params = {
			_id: req.params.id,
		};
		const updateConfig = "set content = :content, updatedAt = :updatedAt";
		const newVal = {
			":content": req.body.content,
			":updatedAt": date.toISOString(),
		};

		const response = await updateItem(params, TABLENAME, updateConfig, newVal);

		return res.status(200).json({ message: "Post Successfully Updated!", data: response });
	} catch (e: any) {
		return res.status(401).json(e.message);
	}
};

const deletePost = async (req: Request, res: Response) => {
	try {
		const params = {
			_id: req.params.id,
		};

		const response = await deleteItem(params, TABLENAME);
		return res.status(200).json({ message: "Post Successfully Deleted!", data: response });
	} catch (e: any) {
		return res.status(401).json(e.message);
	}
};

export default { createPost, getAllPost, getAllUserPost, updatePost, deletePost };
