/**
 * Report Model
 * 
 * Architectural Decision: Embedded references to user via ObjectId
 * Trade-off: Using references instead of embedding user data allows
 * for data normalization and easier updates. This is a classic
 * database design trade-off where we prioritize data consistency
 * over read performance (which can be optimized with populate()).
 */

import mongoose, { Document, Schema } from "mongoose";

export type ReportCategory = "waste" | "water" | "road";
export type ReportStatus = "pending" | "in-progress" | "resolved";

export interface IReport extends Document {
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  location: string;
  imageUrl?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["waste", "water", "road"],
        message: "{VALUE} is not a valid category",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "resolved"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// Architectural Decision: Adding compound index on status and createdAt
// Trade-off: Indexes improve read performance but slow down writes.
// This is acceptable since reports are read far more often than created.
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IReport>("Report", reportSchema);
