import express from "express";
import follows from "../middleware/follows.js";

const router = express.Router();

router.post("/create", follows.createFollower);

router.get("/getFollowing", follows.getFollowing);
router.get("/getFollowers", follows.getFollowers);

router.delete("/unfollow", follows.unfollow);

export default router;
