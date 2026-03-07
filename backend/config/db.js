import mongoose from "mongoose";

import { env } from "./env.js";

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(env.mongodbUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;
