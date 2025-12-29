import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware.js";
import corsOptions from "./config/corsOptions.config.js";

// Import Routes
import healthCheckRouter from "./routes/healthCheck.route.js";
import userRouter from "./routes/user.route.js";
import contentRouter from "./routes/content.route.js";
import LinkRouter from "./routes/link.route.js";

dotenv.config();

// Create App
const app = express();

// Common Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // not quite needed in this project
app.use(express.static("public")); // not quite needed in this project

// Routes
app.use("/api/v1/health-check", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/contents", contentRouter);
app.use("/api/v1/links", LinkRouter);

// Error Handler Middleware
app.use(errorHandler);

export default app;



