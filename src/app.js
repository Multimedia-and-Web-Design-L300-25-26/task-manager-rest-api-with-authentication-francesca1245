import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Ensure DB is connected for routes/tests
await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;