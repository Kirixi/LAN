import * as dotenv from "dotenv";

dotenv.config();

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID as string;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;
export const S3_BUCKET = "lan-user-bucket";
export const REGION = process.env.REGION;
