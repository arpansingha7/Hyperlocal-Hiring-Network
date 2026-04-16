import mongoose from "mongoose";

let isConnected = false;

const dbConnection = async () => {
    mongoose.set('strictQuery', true);
    
    if (isConnected) {
        console.log("MongoDB is already connected securely using Cache");
        return;
    }

    try {
        await mongoose.connect(process.env.DB_URL, {
            dbName: "Job_Portal",
        });
        isConnected = true;
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log(`Failed to connect ${error}`);
    }
}
export default dbConnection;