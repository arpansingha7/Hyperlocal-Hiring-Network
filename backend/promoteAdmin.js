import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import { config } from "dotenv";

config({ path: "./config/config.env" });

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.DB_URL, { dbName: "Job_Portal" });
        console.log("Connected to DB...");
        
        const user = await User.findOneAndUpdate(
            { email },
            { role: "Admin", isVerified: true },
            { new: true }
        );
        
        if (user) {
            console.log(`User ${email} promoted to Admin successfully!`);
        } else {
            console.log(`User ${email} not found.`);
        }
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

const userEmail = process.argv[2];
promoteToAdmin(userEmail);
