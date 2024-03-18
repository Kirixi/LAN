import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "./db/connect.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";

dotenv.config();

export const app = express();

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

app.listen(PORT, async () => {
  console.log(`App is listening on port ${PORT}`);
  await connectDb();
});
