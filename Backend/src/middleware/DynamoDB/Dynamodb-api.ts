import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { client } from "../../db/connect.js";
import { v4 as uuidv4 } from "uuid";

const docClient = DynamoDBDocumentClient.from(client);

export const main = async () => {
	const command = new PutCommand({
		TableName: "User-dev",
		Item: {
			user_id: uuidv4(),
			name: "Shiba Inu",
			email: "email@gmail.com",
		},
	});

	const response = await docClient.send(command);
	console.log(response);
	return response;
};
