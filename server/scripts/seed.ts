/**
 * Safe Database Seeding Script
 * 
 * Populates database with sample data without deleting existing entries.
 * Run with: npm run seed
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Report from "../models/Report";
import { connectDatabase, disconnectDatabase } from "../config/database";

dotenv.config();

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@cleancity.com",
    password: "password123",
    role: "admin" as const,
  },
  {
    name: "John Citizen",
    email: "john@example.com",
    password: "password123",
    role: "user" as const,
  },
];

async function seed() {
  try {
    console.log("🌱 Starting safe database seed...");

    await connectDatabase();

    // Add users only if they don't exist
    const createdUsers = [];
    for (const userData of sampleUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
        console.log(`✓ Created user: ${user.email}`);
      } else {
        console.log(`ℹ️  User already exists: ${user.email}`);
      }
      createdUsers.push(user);
    }

    // Sample reports
    const sampleReports = [
      {
        title: "Illegal Waste Dumping on 5th Avenue",
        description: "Large amounts of trash and plastic bags have been dumped on the street corner at 5th Avenue and Main Street.",
        category: "waste",
        status: "pending",
        location: "5th Avenue & Main Street, Harare",
        userId: createdUsers[1]._id,
      },
      {
        title: "Broken Street Light on Park Road",
        description: "The street light on Park Road has been non-functional for two months, creating safety concerns.",
        category: "road",
        status: "pending",
        location: "Park Road, Harare",
        userId: createdUsers[1]._id,
      },
      {
        title: "Overflowing Garbage Bins at Central Market",
        description: "Public garbage bins at Central Market have been overflowing for over a week.",
        category: "waste",
        status: "in-progress",
        location: "Central Market, Bulawayo",
        userId: createdUsers[0]._id,
      },
    ];

    // Only insert reports that don’t exist (based on title)
    for (const reportData of sampleReports) {
      const exists = await Report.findOne({ title: reportData.title });
      if (!exists) {
        await Report.create(reportData);
        console.log(`✓ Created report: ${reportData.title}`);
      } else {
        console.log(`ℹ️  Report already exists: ${reportData.title}`);
      }
    }

    console.log("\n✨ Safe seeding completed!");
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await disconnectDatabase();
    process.exit(1);
  }
}

seed();
