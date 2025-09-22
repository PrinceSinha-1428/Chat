import mongoose from "mongoose";
import { ENV } from "./env";

const connectDB = async () => {
  try {
    if(!ENV.DATABASE_URL) throw new Error("Database URL Missing");
    await mongoose.connect(ENV.DATABASE_URL);
    console.log("Database Connected");
  } catch (error) {
    console.error("Database Failed to Connect", error);
    process.exit(1);
  }
};


export default connectDB;