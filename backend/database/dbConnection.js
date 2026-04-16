import mongoose from "mongoose";

let connectionPromise = null;

const dbConnection = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    mongoose.set('strictQuery', true);

    connectionPromise = mongoose.connect(process.env.DB_URL, {
        dbName: "Job_Portal",
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
    }).then(() => {
        console.log("MongoDB Connected Successfully");
    }).catch((error) => {
        connectionPromise = null;
        console.log(`DB Connection Failed: ${error.message}`);
        throw error;
    });

    return connectionPromise;
}
export default dbConnection;