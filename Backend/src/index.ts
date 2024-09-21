import dotenv from "dotenv";
import { connectDb } from "./db/connect.js";
import createServer from "./server.js";
import { AWS_SECRET_KEY, AWS_ACCESS_KEY, S3_BUCKET, REGION } from "./utils/variables.js";

dotenv.config();

const PORT = 8080;

const app = createServer();

app.get("/", (req, res) => {
	res.status(200).send("hello world!");
});

app.listen(PORT, async () => {
	console.log(`App is listening on port ${PORT}`);
	console.log("Aws access key:", AWS_ACCESS_KEY);
	console.log("Aws private key:", AWS_SECRET_KEY);
	console.log("S3: ", S3_BUCKET);
	console.log("Region: ", REGION);

	await connectDb();
});
