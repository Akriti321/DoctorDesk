import express from "express";
import {
    createChat,
    sendMessage,
    getMessages
}
from "../controllers/chatController.js";
const chatRouter = express.Router();

chatRouter.post("/create", createChat);
chatRouter.post("/send", sendMessage);
chatRouter.get("/:appointmentId", getMessages);

export default chatRouter;