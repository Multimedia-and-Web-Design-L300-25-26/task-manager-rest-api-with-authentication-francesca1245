import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  const { title, description, completed } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await Task.create({
    title,
    description,
    completed,
    owner: req.user._id
  });

  return res.status(201).json(task);
});

// GET /api/tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id });
  return res.status(200).json(tasks);
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.owner !== req.user._id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await Task.deleteOne({ _id: req.params.id, owner: req.user._id });
  // Francesca: enforce owner-only deletion to prevent horizontal privilege issues
  return res.status(200).json({ message: "Task deleted" });
});

export default router;