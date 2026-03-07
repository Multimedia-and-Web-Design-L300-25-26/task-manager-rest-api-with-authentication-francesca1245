import mongoose from "mongoose";

// Create Task schema
// Fields:
// - title (String, required)
// - description (String)
// - completed (Boolean, default false)
// - owner (ObjectId, ref "User", required)
// - createdAt (default Date.now)

const taskSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	completed: { type: Boolean, default: false },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	createdAt: { type: Date, default: Date.now }
});

// In-memory storage for tasks to avoid external DB dependency
const tasks = [];

const Task = {
	async create(data) {
		const task = {
			...data,
			_id: new mongoose.Types.ObjectId().toString(),
			completed: data.completed ?? false,
			createdAt: new Date()
		};
		tasks.push(task);
		return task;
	},
	async find(query) {
		if (query.owner) return tasks.filter((t) => t.owner === query.owner);
		return [...tasks];
	},
	async findById(id) {
		return tasks.find((t) => t._id === id) || null;
	},
	async deleteOne(filter) {
		const index = tasks.findIndex((t) => t._id === filter._id && (!filter.owner || t.owner === filter.owner));
		if (index === -1) return { deletedCount: 0 };
		tasks.splice(index, 1);
		return { deletedCount: 1 };
	}
};

export default Task;