import * as AWS from "aws-sdk";
import { AWS_SECRET_KEY, AWS_ACCESS_KEY, S3_BUCKET } from "../utils/variables.js";
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { Response, Request } from "express";

const accessKeyId = AWS_ACCESS_KEY;
const secretAccessKey = AWS_SECRET_KEY;
const validTimer = 3000; //50 Mins
const validTimerUpload = 500;

const s3 = new S3Client({
	region: process.env.REGION,
	credentials: fromEnv(),
});

const getURL = async (req: Request, res: Response) => {
	try {
		const imgName = req.params.parent_id + "/" + req.params.imgName;
		console.log(req.params);
		console.log(imgName);
		const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: imgName });
		const url = await getSignedUrl(s3, command, { expiresIn: validTimer });
		return res.status(200).json({ url: url });
	} catch (e: any) {
		console.log(e);
		return res.status(401).json({ message: e.message });
	}
};

export const uploadFile = async (imgName: string) => {
	try {
		const command = new PutObjectCommand({ Bucket: S3_BUCKET, Key: imgName, ContentType: "image/jpeg" });
		return await getSignedUrl(s3, command, { expiresIn: validTimerUpload });
	} catch (e: any) {
		console.log(e);
		throw e;
	}
};

export const getImagePresignUrl = async (imgName: string) => {
	try {
		const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: imgName });
		return await getSignedUrl(s3, command, { expiresIn: validTimer });
	} catch (e: any) {
		console.log(e);
		throw e;
	}
};

export default { getURL };
