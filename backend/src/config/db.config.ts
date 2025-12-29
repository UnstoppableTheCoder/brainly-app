import mongoose from "mongoose";
import logger from "./logger.config.js";

export const connectDB = async (): Promise<void> => {
  try {
    const { MONGODB_URI, DB_NAME } = process.env;

    if (!MONGODB_URI || !DB_NAME) {
      logger.error(
        "❌ Environment Variable(s) missing: MONGODB_URI or DB_NAME"
      );
      throw new Error(
        "MONGODB_URI or DB_NAME is missing in environment variables"
      );
    }

    const uri = `${MONGODB_URI}/${DB_NAME}`;

    // Connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 connections
    };

    const connectionInstance = await mongoose.connect(uri, options);

    logger.info(`✅ MongoDB connected: ${connectionInstance.connection.host}`);
    logger.info(`📦 Database: ${connectionInstance.connection.name}`);

    // Connection event listeners
    mongoose.connection.on("connected", () => {
      logger.info("🔗 Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("❌ Mongoose connection error:", {
        message: err.message,
        stack: err.stack,
      });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ Mongoose disconnected from MongoDB");
    });

    // Graceful shutdown handlers
    process.on("SIGINT", async () => { // know more about it
      await mongoose.connection.close();
      logger.info(
        "🔌 MongoDB connection closed due to app termination (SIGINT)"
      );
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await mongoose.connection.close();
      logger.info(
        "🔌 MongoDB connection closed due to app termination (SIGTERM)"
      );
      process.exit(0);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error("❌ MongoDB connection failed", {
        message: error.message,
        stack: error.stack,
      });
    } else {
      logger.error("❌ MongoDB connection failed", { error });
    }

    process.exit(1);
  }
};
