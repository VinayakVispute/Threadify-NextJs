import mongoose from "mongoose";

let isConnected = false; // vaiable to check if mongoose is connected or not

export const connectToDb = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Already connected to DB");

  try {
    mongoose.connect(process.env.MONGODB_URL);

    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
};
