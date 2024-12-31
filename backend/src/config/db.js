// src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_DB_URL;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

// Initialize a global variable to cache the connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    // If a connection is already established, return it
    return cached.conn;
  }

  if (!cached.promise) {
    // If no connection promise exists, create one
    const opts = {
      // Other options as needed
    };

    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongoose) => mongoose);
  }

  try {
    // Await the connection promise and cache the connection
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
  } catch (error) {
    // If connection fails, reset the cache and throw the error
    cached.promise = null;
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }

  return cached.conn;
};

export default connectDB;
