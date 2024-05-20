import * as AWS from "aws-sdk";
import { AWS_SECRET_KEY, AWS_ACCESS_KEY } from "../utils/variables.js";

const accessKeyId = AWS_ACCESS_KEY;
const secretAccessKey = AWS_SECRET_KEY;

AWS.config.update({
	region: "ap-southeast-1",
	accessKeyId,
	secretAccessKey,
});
