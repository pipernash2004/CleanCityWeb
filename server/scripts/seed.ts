/**
 * Database Seeding Script
 * 
 * This script populates the database with sample data for testing.
 * Run with: npm run seed
 * 
 * Creates:
 * - 2 users (1 admin, 1 regular user)
 * - 6 sample reports with varying statuses
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
    console.log("🌱 Starting database seed...");

    // Connect to database
    await connectDatabase();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Report.deleteMany({});

    // Create users
    console.log("👥 Creating users...");
    const users = await User.create(sampleUsers);
    console.log(`✓ Created ${users.length} users`);

    // Create sample reports
    console.log("📝 Creating sample reports...");
    const sampleReports = [
      {
        title: "Illegal Waste Dumping on 5th Avenue",
        description: "Large amounts of trash and plastic bags have been dumped on the street corner at 5th Avenue and Main Street. This has been ongoing for several weeks and is creating health hazards for the community.",
        category: "waste",
        status: "pending",
        location: "5th Avenue & Main Street, Harare",
        userId: users[1]._id,
      },
      {
        title: "Water Pipe Burst Near Community Center",
        description: "A major water leak from a broken pipe is causing flooding on the road near the community center. Water is being wasted continuously and the road surface is becoming damaged.",
        category: "water",
        status: "in-progress",
        location: "Community Center Road, Bulawayo",
        userId: users[1]._id,
      },
      {
        title: "Large Pothole on Highway Exit",
        description: "There is a deep pothole on Highway 2 Exit 12 that is causing vehicle damage and creating traffic delays. Multiple cars have reported tire damage from this pothole.",
        category: "road",
        status: "resolved",
        location: "Highway 2 Exit 12",
        userId: users[0]._id,
      },
      {
        title: "Broken Street Light on Park Road",
        description: "The street light on Park Road has been non-functional for two months, creating safety concerns for pedestrians at night. The area is poorly lit and residents are worried about security.",
        category: "road",
        status: "pending",
        location: "Park Road, Harare",
        userId: users[1]._id,
      },
      {
        title: "Overflowing Garbage Bins at Central Market",
        description: "The public garbage bins at Central Market have been overflowing for over a week. This is attracting pests and creating unsanitary conditions for market vendors and shoppers.",
        category: "waste",
        status: "in-progress",
        location: "Central Market, Bulawayo",
        userId: users[0]._id,
      },
      {
        title: "Leaking Fire Hydrant on Market Street",
        description: "A fire hydrant on Market Street is continuously leaking water, wasting valuable water resources and creating slippery conditions on the sidewalk.",
        category: "water",
        status: "resolved",
        location: "Market Street, Harare",
        userId: users[1]._id,
      },
    ];

    const reports = await Report.create(sampleReports);
    console.log(`✓ Created ${reports.length} reports`);

    console.log("\n✨ Seeding completed successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("Admin:");
    console.log("  Email: admin@cleancity.com");
    console.log("  Password: password123");
    console.log("\nUser:");
    console.log("  Email: john@example.com");
    console.log("  Password: password123");

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await disconnectDatabase();
    process.exit(1);
  }
}

seed();
