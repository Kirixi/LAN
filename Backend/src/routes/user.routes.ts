import express from "express";
import user from "../middleware/user.js";

const router = express.Router();

//Post endpoints
router.post("/create", user.createUser);
router.post("/login", user.login);

//Get endpoints
router.get("/all", user.getAllUsers);
router.get("/select/:id", user.getUserById);
router.get("/getUser/:username", user.getUserbyUsername);
router.get("/getUsername/:email", user.getUsernamebyEmail);
router.get("/verifyEmail/:email", user.verifyEmail);


router.put("/updateName/:id", user.updateUsername);
router.put("/updateEmail/:id", user.updateEmail);
router.put("/updateStatus/:id", user.updateStatus);

router.delete("/delete/:id", user.deleteUser);

export default router;
