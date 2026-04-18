import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();
app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});