import routes from "./routes/index.ts";
import express from "express";
import cors from "cors";

function createServer() {

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());

    routes(app);

    return app;
}

export default createServer;