import express from "express";
import { nanoid } from "nanoid";
import Topic from "../models/Topic.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();


/*
  🔐 Middleware yaha laga sakte ho
  Example:
  import authMiddleware from "../middleware/auth.js";
*/





// 🔹 Get Shared Conversation (Public)
router.get("/public/:shareId", async (req, res) => {
  try {
    const topic = await Topic.findOne({
      shareId: req.params.shareId,
      isShared: true
    }).select("-userId");

    if (!topic) {
      return res.status(404).json({ message: "Not found" });
    }

    if (topic.shareExpire && topic.shareExpire < Date.now()) {
      return res.status(410).json({ message: "Link expired" });
    }

    res.json(topic);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});





router.post("/unshare/:id", authMiddleware, async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return res.status(404).json({ message: "Not found" });
  }

  if (conversation.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  conversation.isShared = false;
  conversation.shareId = undefined;
  conversation.shareExpire = undefined;

  await conversation.save();

  res.json({ message: "Sharing disabled" });
});



router.post("/share/:id", authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    if (topic.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!topic.shareId) {
      topic.shareId = nanoid(12);
      topic.isShared = true;
      topic.shareExpire = Date.now() + 24 * 60 * 60 * 1000;
      await topic.save();
    }

    res.json({
      shareLink: `${process.env.WORK_UR}/share/${topic.shareId}`
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
