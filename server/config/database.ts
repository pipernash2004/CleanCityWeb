/**
 * Database Configuration
 * 
 * Architectural Decision: Centralized database connection logic
 * This module handles MongoDB connection with error handling and
 * connection pooling managed by Mongoose.
 * 
 * Trade-off: Using in-memory MongoDB for development simplicity
 * on Replit. In production, this would connect to MongoDB Atlas
 * or another hosted solution.
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cleancity";

export async function connectDatabase(): Promise<void> {
  try {
    // Mongoose connection options for optimal performance
    const options = {
      // No deprecated options needed for Mongoose 6+
    };

    await mongoose.connect(MONGODB_URI, options);
    
    console.log("✓ MongoDB connected successfully");
    
    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // In production, you might want to exit the process
    // process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}
