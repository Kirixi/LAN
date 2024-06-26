import { Express } from "express";

import userRoute from "../routes/user.routes.js";
import postRoute from "../routes/post.routes.js";
import commentRoute from "../routes/comment.routes.js";
import followRoute from "../routes/follows.routes.js";
import bucketRoute from "./s3bucket.routes.js";

export default function (app: Express) {
	app.use("/api/user", userRoute);
	app.use("/api/post", postRoute);
	app.use("/api/comment", commentRoute);
	app.use("/api/follows", followRoute);
	app.use("/api/bucket", bucketRoute);
}
