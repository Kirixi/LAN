import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "./db/connect.js";

dotenv.config();

export const app = express();

const PORT = 8000;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('hello world!')

})

app.listen(PORT, async () => {
    console.log(`App is listening on port ${PORT}`)
    await connectDb();
})