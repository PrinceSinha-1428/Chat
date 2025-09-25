import { getAllContacts, getChatPartners, getMessageByUserId, sendMessage } from "@controllers/message.controller";
import { protectRoute } from "@middlewares/auth.middleware";
import { Router } from "express";

const messageRouter = Router();

messageRouter.use(protectRoute);
messageRouter.get("/contacts", getAllContacts);
messageRouter.get("/chats", getChatPartners);
messageRouter.get("/:id", getMessageByUserId);
messageRouter.post("/send/:id", sendMessage);

export default messageRouter;