import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: String,
  message: String,
  reply: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", chatSchema);
