import express from "express";
import comment from "../middleware/comment.js";

const router = express.Router();

router.post("/create", comment.createComment);

router.get("/getPostComments/:id", comment.getPostComments);
router.get("/getUserComments/:id", comment.getUserComments);

router.put("/update", comment.updateComment);

router.delete("/delete", comment.deleteComment);

export default router;