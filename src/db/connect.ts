import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import { User } from "./interfaces.js";
// import { createCollections } from "./collections.js";

const mongoConnectionString =
  "mongodb://admin:admin@localhost:27017?authSource=admin";

export const client = mongoose.connect(mongoConnectionString);

async function connectDb() {
  try {
    console.log("db successfully connected");
    // createCollections();

    // console.log(collections)
    // if (collections.length <= 0) {
    //     createCollections();
    // } else {
    //     console.log("User collection detected");
    // }
  } catch (e) {
    console.log("Error connecting to db");
  }
}

export { connectDb };
