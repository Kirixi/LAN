import express from "express";
import follows from "../middleware/follows.js";

const router = express.Router();

router.post("/create", follows.createFollower);

router.get("/getFollowing/:id", follows.getFollowing);
router.get("/getFollowers/:id", follows.getFollowers);
router.get("/unfollowAccounts/:id", follows.getUnfollowAccounts);

router.delete("/unfollow/:id", follows.unfollow);

export default router;
