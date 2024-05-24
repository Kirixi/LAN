import * as AWS from "aws-sdk";
import { AWS_SECRET_KEY, AWS_ACCESS_KEY, S3_BUCKET } from "../utils/variables.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl, S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-provider-env";

const accessKeyId = AWS_ACCESS_KEY;
const secretAccessKey = AWS_SECRET_KEY;
const validTimer = 300;
const validTimerUpload = 500;

const s3 = new S3Client({
	region: process.env.REGION,
	credentials: fromEnv(),
});

const getURL = async (imgName: string) => {
	try {
		const url = await s3.getSignedUrlPromise("getObject", {
			Bucket: S3_BUCKET,
			key: `posts/${imgName}`,
			Expires: validTimer,
		});
		console.log({ url });
	} catch (e: any) {
		console.log(e);
		throw e;
	}
};

const uploadFile = async (imgName: string) => {
	try {
		const command = new PutObjectCommand({ Bucket: S3_BUCKET, Key: imgName, ContentType: "image/jpeg" });
		return await getSignedUrl(s3, command, { expiresIn: validTimerUpload });
	} catch (e: any) {
		console.log(e);
		throw e;
	}
};

export { getURL, uploadFile };
