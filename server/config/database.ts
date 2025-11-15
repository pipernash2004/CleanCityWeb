/**
 * Database Configuration
 *
 * Architectural Decision:
 * - Centralized database connection logic.
 * - Uses MongoDB Atlas in production (via .env), or exits early if misconfigured.
 *
 * Trade-off:
 * - Explicit dotenv loading ensures predictable startup behavior.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoClient, GridFSBucket } from "mongodb";

// Load environment variables early
dotenv.config({ path: "server/.env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "❌ MONGODB_URI not found in environment variables. Check your .env file."
  );
  process.exit(1);
}

/**
 * Connect to MongoDB using Mongoose
 */
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI!, {
      retryWrites: true,
      w: "majority",
    });

    console.log("✓ MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}

/**
 * MongoDB native client and GridFSBucket setup
 */
const client = new MongoClient(MONGODB_URI);
await client.connect();

const db = client.db(); // Default database from URI

export const gridFSBucket = new GridFSBucket(db, {
  bucketName: "images", // Corrected spelling
});

export { db, client };
