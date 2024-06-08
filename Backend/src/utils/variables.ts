import * as dotenv from "dotenv";

dotenv.config();

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const S3_BUCKET = process.env.S3_BUCKET;
