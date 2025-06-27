const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook"; 

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