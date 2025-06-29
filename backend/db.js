const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit if can't connect to database
    }
}

module.exports = connectToMongo;