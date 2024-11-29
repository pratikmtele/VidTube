import mongoose from "mongoose";
import { MONGO_DB } from "../constants.js";

export const connectDB = async () => {
  const datbaseConnection = await mongoose.connect(
    `${process.env.MONGO_URL}/${MONGO_DB}`
  );
  console.log(`Database connected, Host: `, datbaseConnection.connection.host);

  try {
  } catch (error) {
    console.log("Database Connection:", error);
  }
};
