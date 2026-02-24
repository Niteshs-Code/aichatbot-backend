import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
shareId: {
    type: String,
    unique: true,
    sparse: true
  },
  isShared: {
    type: Boolean,
    default: false
  },
  shareExpire: {
    type: Date
  },

  title: String,
  messages: [String]
}, { timestamps: true });

export default mongoose.model("Topic", topicSchema);
