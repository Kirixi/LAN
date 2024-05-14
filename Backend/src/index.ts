import dotenv from "dotenv";
import { connectDb } from "./db/connect.js";
import createServer from "./server.js";
import { getItemById } from "./middleware/DynamoDB/Dynamodb-api.js";

dotenv.config();

const PORT = 8080;

const app = createServer();

app.get("/", (req, res) => {
	res.status(200).send("hello world!");
});

app.listen(PORT, async () => {
	console.log(`App is listening on port ${PORT}`);

	await connectDb();
	// await getItemById({ user_id: "9e87e17f-a975-4784-8145-7cd483c13e06" }, "User-dev");
});
