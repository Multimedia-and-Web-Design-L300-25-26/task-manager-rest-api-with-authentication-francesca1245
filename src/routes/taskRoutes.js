import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware (protect all task routes)
router.use(authMiddleware);

// POST /api/tasks - create task for logged-in user
router.post("/", async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      owner: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tasks - get only user tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id - only owner can delete
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: not task owner" });
    }

    await task.deleteOne();
    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;