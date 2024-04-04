import { Express } from "express";

import userRoute from "../routes/user.routes.js";
import postRoute from "../routes/post.routes.js";
import commentRoute from "../routes/comment.routes.js";

export default function (app: Express) {
    app.use("/api/user", userRoute);
    app.use("/api/post", postRoute);
    app.use("/api/comment", commentRoute)
}