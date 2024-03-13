import express from "express";
import user from "../middleware/user.js";

const router = express.Router();

router.post("/create", user.createUser);
router.get("/all", user.getAllUsers);

export default router;
