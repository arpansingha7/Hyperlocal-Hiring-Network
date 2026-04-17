import mongoose from "mongoose";
import { User } from "./backend/models/userSchema.js";
import { config } from "dotenv";

config({ path: "./backend/config/config.env" });

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
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
if (!userEmail) {
    console.log("Please provide an email: node promoteAdmin.js example@test.com");
} else {
    promoteToAdmin(userEmail);
}
