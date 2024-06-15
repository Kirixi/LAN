import * as dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
// import { createCollections } from "./collections.js";
dotenv.config();
const mongoConnectionString: any = process.env.CONNECTION_STRING;

export const client = mongoose.connect(mongoConnectionString);

async function connectDb() {
	try {
		await client;
		if (mongoose.connection.readyState === 1) {
			console.log("Database connected successfully.");
		} else {
			console.log("Failed to connect to the database");
		}
	} catch (e: any) {
		console.log("Error connecting to db", e.message);
	}
}

export { connectDb };
