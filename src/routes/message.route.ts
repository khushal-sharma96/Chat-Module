import express from "express";
import authMiddleware from "../middleware/auth.middleware"
const Router = express.Router();
import { RecipientList, SendMessage, SeenMessage, DeleteMessage, AllMessages } from "../controllers/message.controller"

/** Get the list of recipients */
Router.get("/all-clients", authMiddleware, RecipientList);

/**
 * For sending the message
 */
Router.post("/send-message", authMiddleware, SendMessage);

/**
 * To delete the sent message
 */
Router.post("/delete-message", authMiddleware, DeleteMessage);

/**
 * Function to mark the message as seen.
 */
Router.get("/seen-message/:messageId", authMiddleware, SeenMessage);

/**
 * Function to get all messages of the given chats
 */
Router.get("/all-message/:channelId", authMiddleware, AllMessages);


export default Router;