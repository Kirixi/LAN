import {
	PutCommand,
	GetCommand,
	UpdateCommand,
	DeleteCommand,
	QueryCommand,
	ScanCommand,
	DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { client } from "../../db/connect.js";

const docClient = DynamoDBDocumentClient.from(client);

const getItemById = async (params: Object, table: string, projExp: string, expAtt: any) => {
	try {
		const command = new GetCommand({
			TableName: table,
			Key: params,
			ProjectionExpression: projExp,
			ExpressionAttributeNames: expAtt,
		});

		const response = await docClient.send(command);
		console.log(response.Item);
		return response;
	} catch (e: any) {
		throw e;
	}
};

const createItem = async (item: Object, table: string) => {
	try {
		const command = new PutCommand({
			TableName: table,
			Item: item,
			ReturnValues: "ALL_OLD",
		});

		const response = await docClient.send(command);
		console.log(response);
		return response;
	} catch (e: any) {
		throw e;
	}
};

const updateItem = async (params: Object, table: string, updateconfig: string, newVal: Object) => {
	try {
		const command = new UpdateCommand({
			TableName: table,
			Key: params,
			UpdateExpression: updateconfig,
			ExpressionAttributeValues: newVal,
			ReturnValues: "ALL_NEW",
		});

		const response = await docClient.send(command);
		console.log(response.Attributes);
		return response;
	} catch (e: any) {
		throw e;
	}
};

const deleteItem = async (params: Object, table: string) => {
	const command = new DeleteCommand({
		TableName: table,
		Key: params,
	});

	const response = await docClient.send(command);
	console.log(response.Attributes);
	return response;
};

const queryTable = async (params: Object, table: string, queryExp: string) => {
	try {
		const command = new QueryCommand({
			TableName: table,
			KeyConditionExpression: queryExp,
			ExpressionAttributeValues: params,
			ConsistentRead: true,
		});

		const response = await docClient.send(command);
		console.log(response);
		return response;
	} catch (e: any) {
		throw e;
	}
};

const gsiSearch = async (params: Object, table: string, queryExp: string, gsiName: string) => {
	try {
		const command = new QueryCommand({
			TableName: table,
			IndexName: gsiName, // GSI stands for Global Secondary Index
			KeyConditionExpression: queryExp,
			ExpressionAttributeValues: params,
		});
		const response = await docClient.send(command);
		console.log(response.Items);
		return response;
	} catch (e: any) {
		throw e;
	}
};

const scanTable = async (table: string) => {
	try {
		const command = new ScanCommand({
			TableName: table,
		});
		const response = await docClient.send(command);

		return response;
	} catch (e: any) {
		throw e;
	}
};
export { getItemById, createItem, updateItem, deleteItem, queryTable, gsiSearch, scanTable };
