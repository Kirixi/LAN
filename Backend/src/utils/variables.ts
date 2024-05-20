import * as dotenv from "dotenv";

dotenv.config();

export const AWS_ACCESS_KEY = process.env.ACCESS_KEY_ID;
export const AWS_SECRET_KEY = process.env.SECRET_ACCESS_KEY;
