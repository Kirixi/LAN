import express from "express";
import user from "../middleware/user.js";

const router = express.Router();

//Post endpoints
router.post("/create", user.createUser);

//Get endpoints
router.get("/all", user.getAllUsers);
router.get("/select/:id", user.getUserById);
router.get("/getUser/:username", user.getUserbyUsername);
router.get("/getUsername/:email", user.getUsernamebyEmail);
router.get("/login", user.login);

router.put("/updatename/:id", user.updateUsername);


export default router;
