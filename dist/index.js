import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
export const app = express();
const mongoConnectionString = "mongodb://admin:admin@localhost:27017?authSource=admin";
async function connectToDB(connectionString) {
    await mongoose.connect(connectionString);
    console.log("Connection Successful");
}
try {
    await connectToDB(mongoConnectionString);
}
catch (e) {
    console.log("Error connecting to DB", e);
}
const PORT = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get('/', (req, res) => {
    res.status(200).send('hello world!');
});
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map