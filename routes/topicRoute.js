import express from "express";
import {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
  addMessage
} from "../controllers/topicController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message/:id", authMiddleware, addMessage);
router.post("/", authMiddleware, createTopic);
router.get("/", authMiddleware, getTopics);
router.put("/:id", authMiddleware, updateTopic);
router.delete("/:id", authMiddleware, deleteTopic);


export default router;
