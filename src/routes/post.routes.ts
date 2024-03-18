import express from "express";
import post from "../middleware/post.js";

const router = express.Router();

router.post("/create", post.createPost);
// router.get("/all", post.getAllUsers);

export default router;
