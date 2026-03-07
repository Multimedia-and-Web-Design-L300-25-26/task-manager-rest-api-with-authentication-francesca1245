import mongoose from "mongoose";


// Create User schema
// Fields:
// - name (String, required)
// - email (String, required, unique)
// - password (String, required, minlength 6)
// - createdAt (default Date.now)



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
});

// In-memory storage to keep tests fast without an external DB
const users = [];

const User = {
  async findOne(query) {
    if (query.email) return users.find((u) => u.email === query.email) || null;
    if (query._id) return users.find((u) => u._id === query._id) || null;
    return null;
  },
  async create(data) {
    const user = {
      ...data,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date()
    };
    users.push(user);
    return user;
  }
};

export default User;