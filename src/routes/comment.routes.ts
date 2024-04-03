import express from "express";
import comment from "../middleware/comment.js";

const router = express.Router();

router.post("/create", comment.createComment);

router.get("/getPostComments/:id", comment.getPostComments);
router.get("/getUserComments/:email", comment.getUserComments);

router.put("/update/:id", comment.updateComment);

router.delete("/delete/:id", comment.deleteComment);

export default router;