import * as AWS from "aws-sdk";
import { AWS_SECRET_KEY, AWS_ACCESS_KEY, S3_BUCKET } from "../utils/variables.js";
import { S3Client, GetObjectCommand, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { Response, Request } from "express";

const validTimer = 3000; //50 Mins
const validTimerUpload = 500;
const bucketName = S3_BUCKET.trim();

const s3Configuration: S3ClientConfig = {
	credentials: {
		accessKeyId: AWS_ACCESS_KEY,
		secretAccessKey: AWS_SECRET_KEY,
	},
	region: "ap-northeast-1",
};

const s3 = new S3Client(s3Configuration);

const getURL = async (req: Request, res: Response) => {
	try {
		const imgName = req.query.parent_id + "/" + req.query.imgName;
		const command = new GetObjectCommand({ Bucket: bucketName, Key: imgName });
		const url = await getSignedUrl(s3, command, { expiresIn: validTimer });
		return res.status(200).json({ url: url });
	} catch (e: any) {
		return res.status(401).json({ message: e.message });
	}
};

export const uploadFile = async (imgName: string) => {
	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: imgName, // The file name (or path) to be uploaded
		ContentType: "image/png", // MIME type of the file
	});
	const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // Set expiration time for the upload URL
	return url;
};

export const getImagePresignUrl = async (imgName: string) => {
	const command = new GetObjectCommand({ Bucket: bucketName, Key: imgName });
	const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
	return url;
};

export default { getURL };
