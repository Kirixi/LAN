import express from "express";
import bucket from "../middleware/s3-operations.js";

const router = express.Router();

router.get("/getSingle", bucket.getURL);

export default router;
