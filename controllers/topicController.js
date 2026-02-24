import Topic from "../models/Topic.js"
import { getAIReply } from "../services/aiService.js";

export const createTopic = async (req, res) => {
  const { title } = req.body;

  const aiText = await getAIReply(title);

  const topic = await Topic.create({
    userId: req.user.id,
    title: title,
    messages: [
      `User: ${title}`,
      `AI: ${aiText}`
    ]
  });

  res.json(topic);
};

export const addMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const aiText = await getAIReply(message);

  const topic = await Topic.findById(id);

  topic.messages.push(`User: ${message}`);
  topic.messages.push(`AI: ${aiText}`);

  await topic.save();

  res.json(topic);
};



export const getTopics = async (req, res) =>{
    const topics = await Topic.find({userId: req.user.id});
    res.json(topics);
}

export const updateTopic = async (req, res) =>{
    const topic = await Topic.findByIdAndUpdate(
        req.params.id,
        {title: req.body.title},
        {new: true}
    )

    res.json(topic);
}

export const deleteTopic = async (req, res) => {
  await Topic.findByIdAndDelete(req.params.id);
  res.json({ message: "Topic deleted" });
};