import mongoose from "mongoose";

import { DB_NAME } from "../src/constant.js";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDb;
