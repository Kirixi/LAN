import express from "express";
import post from "../middleware/post.js";

const router = express.Router();

router.post("/create", post.createPost);
router.get("/all", post.getAllPost);
router.put("/update/:id", post.updatePost);
router.delete("/delete/:id", post.deletePost);

export default router;
