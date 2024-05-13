import dotenv from "dotenv";
import { connectDb } from "./db/connect.js";
import createServer from "./server.js";
import { main } from "./middleware/DynamoDB/Dynamodb-api.js";

dotenv.config();

const PORT = 8080;

const app = createServer();


app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

app.listen(PORT, async () => {
  console.log(`App is listening on port ${PORT}`);
  
  await connectDb();
  main();
});


