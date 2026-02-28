import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { getAIReply } from "./services/aiService.js";
import  authMiddleware  from "./middleware/authMiddleware.js";
import chat from "./models/chatModel.js";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import topicRoute from "./routes/topicRoute.js";
import passport from "./config/passport.js";
import conversationRoute from './routes/conversationRoute.js'
import { sendTestEmail } from "./utils/sendEmail.js";


connectDB();
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use('/api/auth', authRoute);
app.use('/api/topics', topicRoute);
app.use("/api/conversation", conversationRoute);
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("AI Backend Running perfectly url has been updated");
});


app.post("/api/chat",authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await getAIReply(message);
    await chat.create({
        userId : req.user.id,
        message,
        reply
    });
    res.json({reply})

    

  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get("/test-email-deploy", async (req, res) => {
  try {
    await sendTestEmail("feasession8@gmail.com");
    res.send("Email sent from deploy");
  } catch (err) {
    console.log("DEPLOY ERROR:", err);
    res.status(500).send(err.message);
  }
});

app.get("/api/history", authMiddleware, async(req, res)=>{
    const chats = await chat.find({userId: req.user.id});
    res.json(chats);
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});




