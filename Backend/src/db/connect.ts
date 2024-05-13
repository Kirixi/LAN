import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import * as dotenv from "dotenv";

dotenv.config();

export const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: fromEnv()
});

async function connectDb() {
  try {
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    console.log("Db connected!");
  } catch (e: any) {
    console.log("Error connecting to db", e.message);
  }
}
export { connectDb };

