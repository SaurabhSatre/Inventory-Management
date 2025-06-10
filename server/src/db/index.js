import mongoose from "mongoose";

export let dbInstance = undefined;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`mongodb+srv://dharamrajtiwari:biznetize123@cluster0.kz4ehuf.mongodb.net/`);
    dbInstance = connectionInstance;
    console.log(`\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;