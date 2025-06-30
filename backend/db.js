import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log("MONGO_URI is:", process.env.MONGO_URI);


const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(mongoURI, {dbName: "iNotebook"});
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit if can't connect to database
    }
};

export default connectToMongo;
