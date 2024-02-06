import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

const mongoConnectionString = "mongodb://admin:admin@localhost:27017?authSource=admin"


export const client = new MongoClient (mongoConnectionString, { 
    minPoolSize: 10,
})


async function connectDb() {
    try {
        await client.connect();
        console.log("db successfully connected")
    } catch (e) {
        console.log("Error connecting to db");
    }
    
}

export { connectDb }