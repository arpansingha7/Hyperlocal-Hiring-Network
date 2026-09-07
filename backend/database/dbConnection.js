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

    const dbUri = process.env.DB_URL || "mongodb://127.0.0.1:27017/hyperlocal_hiring_network";

    connectionPromise = mongoose.connect(dbUri, {
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