import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({ email, password: hashed });

    // Return user info WITHOUT password
    return res.status(201).json({
      _id: user._id,
      email: user.email,
    });
  } catch (err) {
  return res.status(500).json({ message: err.message });
}
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return token
    const token = signToken(user._id);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;