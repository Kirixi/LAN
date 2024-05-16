import { Response, Request } from "express";
import { User } from "../db/interfaces.js";
import { UserModel } from "../db/collections.js";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { getItemById, createItem, scanTable, gsiSearch, updateItem, deleteItem } from "./DynamoDB/Dynamodb-api.js";
import Joi from "joi";

const TABLENAME = "User-dev";
const PROJECTION_EXP = "#id, email, username, joined, #s";
const ATTRIBUTE_NAME = { "#id": "_id", "#s": "status" };
const createUser = async (req: Request, res: Response) => {
	try {
		const bodyValidation = Joi.object({
			email: Joi.string().email().required().messages({
				"string.email": "Email must be a valid email address.",
				"any.required": "Email is required.",
			}),
			password: Joi.string().required().messages({
				"any.required": "Password is required.",
			}),
			username: Joi.string().required().messages({
				"any.required": "Username is required.",
			}),
			joined: Joi.string().required().messages({
				"any.required": "Joined date is required.",
			}),
		});

		const { error } = bodyValidation.validate(req.body, { abortEarly: false }); // abortEarly: false ensures all errors are reported
		if (error) {
			// Extract detailed error messages
			const validationErrors = error.details[0];

			throw new Error(validationErrors.message);
		}

		const passwordHash = await argon2.hash(req.body.password);

		const user: User = {
			_id: uuidv4(),
			email: req.body.email,
			password: passwordHash,
			username: req.body.username,
			joined: req.body.joined,
			about: "",
		};
		const response = await createItem(user, TABLENAME);
		const userObj = {
			_id: user._id,
			email: user.email,
			username: user.username,
			joined: user.joined,
			about: user.about,
		};
		return res.status(200).json(userObj);
	} catch (e: any) {
		console.log(e);
		return res.status(401).json({ message: e.message });
	}
};

const verifyEmail = async (req: Request, res: Response) => {
	try {
		const queryExpression = "email = :email";
		const params = {
			":email": req.params.email,
		};
		const response = await gsiSearch(params, TABLENAME, queryExpression, "email-joined-index");
		if (response == null) {
			throw new Error("not found");
		}
		return res.status(200).json({ verified: false });
	} catch (e: any) {
		return res.status(200).json({ verified: true });
	}
};

const getUserById = async (req: Request, res: Response) => {
	try {
		const params = {
			_id: req.params.id,
		};
		const response = await getItemById(params, TABLENAME, PROJECTION_EXP, ATTRIBUTE_NAME);
		if (!response.Item) {
			throw new Error("error");
		}
		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(404).json({ message: "User is not found" });
	}
};

const getUsernamebyEmail = async (req: Request, res: Response) => {
	try {
		const queryExpression = "email = :email";
		const params = {
			":email": req.params.email,
		};
		const response = await gsiSearch(params, TABLENAME, queryExpression, "email-joined-index");
		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

const getUserbyUsername = async (req: Request, res: Response) => {
	try {
		const queryExpression = "username = :username";
		const params = {
			":username": req.params.username,
		};
		const response = await gsiSearch(params, TABLENAME, queryExpression, "username-index");
		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

const getAllUsers = async (req: Request, res: Response) => {
	try {
		const response = await scanTable(TABLENAME);
		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

const login = async (req: Request, res: Response) => {
	try {
		const queryExpression = "email = :email";
		const params = {
			":email": req.body.email,
		};
		const response = await gsiSearch(params, TABLENAME, queryExpression, "email-joined-index");
		const passwordHash = req.body.password;
		// @ts-expect-error
		const userPassword: string | undefined = response.password;

		if (userPassword) {
			if (await argon2.verify(userPassword, passwordHash)) {
				// @ts-expect-error
				delete response.password;
				console.log(response);
				return res.status(200).json({ message: "Welcome!", data: response });
			} else {
				return res.status(401).json({ message: "Incorrect password" });
			}
		} else {
			return res.status(404).json({ message: "User is not found" });
		}
	} catch (e: any) {
		return res.status(404).json({ message: "User is not found" });
	}
};

const updateUsername = async (req: Request, res: Response) => {
	try {
		const bodyValidation = Joi.object({
			username: Joi.string().required().messages({
				"any.required": "username is required.",
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
		const updateConfig = "set username = :username";
		const newVal = {
			":username": req.body.username,
		};

		const response = await updateItem(params, TABLENAME, updateConfig, newVal);
		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

const updateEmail = async (req: Request, res: Response) => {
	try {
		const bodyValidation = Joi.object({
			email: Joi.string().email().required().messages({
				"string.email": "Email must be a valid email address.",
				"any.required": "Email is required.",
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
		const updateConfig = "set email = :email";
		const newVal = {
			":email": req.body.email,
		};

		const response = await updateItem(params, TABLENAME, updateConfig, newVal);
		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

const updateStatus = async (req: Request, res: Response) => {
	try {
		const params = {
			_id: req.params.id,
		};
		const updateConfig = "set about = :about";
		const newVal = {
			":about": req.body.about,
		};

		const response = await updateItem(params, TABLENAME, updateConfig, newVal);

		return res.status(200).json(response);
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

const deleteUser = async (req: Request, res: Response) => {
	try {
		const params = {
			_id: req.params.id,
		};
		const response = await deleteItem(params, TABLENAME);

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
	updateStatus,
	deleteUser,
	verifyEmail,
};
