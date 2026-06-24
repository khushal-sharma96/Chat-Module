import { Request, Response } from "express";
import UserModel from "../models/User.model";
import { SendResponse, SendError } from "../helpers/response.helper"
import ChannelModel from "../models/Channel.model";
import MessageModel from "../models/Message.model";
import { AuthRequest, IMessage, MessageDTO } from '../interfaces';
import { Types } from "mongoose";

import {
    SendMessageEvent
    , DeleteMessageEvent
    , SeenMessageEvent
} from "../services/socket.service";
export const RecipientList = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user)
            return null;
        const users = (await UserModel.find({})) || [];

        return SendResponse(res, 200, {
            recipientList: users.filter((row: any) => row._id != user._id)
        });
    }
    catch (err: any) {
        return SendError(res, err?.message);
    }
}

export const SendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user)
            return null;
        const messagePayload = req.body;

        let channel = null;

        if (!messagePayload.channelId && !messagePayload.receiverId)
            return SendError(res, "Send either receiver id or channel id!", 401);

        if (!messagePayload.channelId && messagePayload.receiverId) {
            const channelPayload = {
                senderId: new Types.ObjectId(user._id.toString()),
                receiverId: new Types.ObjectId(messagePayload.receiverId)
            };
            channel = await ChannelModel.findOne(channelPayload.senderId);

            if (!channel)
                channel = await ChannelModel.create(channelPayload);

        }

        if (!channel) {
            channel = await ChannelModel.findById(messagePayload.channelId);
            if (!channel)
                return SendError(res, "Invalid channel id!", 401);
        }

        if (
            !channel.senderId?.equals(user._id.toString()) &&
            !channel.receiverId?.equals(user._id.toString())
        )
            return SendError(res, "You are not authorised with given channel!", 401);


        const message = await MessageModel.create({
            body: messagePayload.body,
            channelId: channel._id,
            sentby: new Types.ObjectId(user._id.toString()),
        });

        const receiptUser = await UserModel.findById(channel.senderId?.equals(user._id.toString()) ? channel.receiverId : channel.senderId);


        SendMessageEvent(receiptUser ? receiptUser.socketIds : [], message);

        return SendResponse(res, 201, message, "Message sent successfully.");
    }
    catch (err: any) {
        return SendError(err?.message);
    }
}

export const SeenMessage = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user)
            return null;
        const messageId = req.params.messageId;

        if (!messageId)
            return SendError(res, "Message id is mandatory!", 401);

        const messageRecord = await MessageModel.findById(messageId);

        if (!messageRecord)
            return SendError(res, "Invalid message id!", 401);

        let channel = await ChannelModel.findById(messageRecord.channelId);

        if (!channel)
            return SendError(res, "Invalid channel id!", 401);

        messageRecord.seenBy = [user._id];
        await messageRecord.save();

        const receiptUser = await UserModel.findById(channel.senderId?.equals(user._id.toString()) ? channel.receiverId : channel.senderId);
        SeenMessageEvent(receiptUser ? receiptUser.socketIds : [], messageRecord);
        return SendResponse(res, 201, messageRecord, "Message seen successfully.");
    }
    catch (err: any) {
        return SendError(err?.message);
    }
}

export const DeleteMessage = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user)
            return null;
        const messageId = req.params.messageId;

        if (!messageId)
            return SendError(res, "Message id is mandatory!", 401);

        const messageRecord = await MessageModel.findById(messageId);

        if (!messageRecord)
            return SendError(res, "Invalid message id!", 401);

        if (!messageRecord.sentby?.equals(user._id.toString()))
            return SendError(res, "You are not authorised to delete this message!", 401);

        messageRecord.deletedAt = new Date().toISOString();
        await messageRecord.save();

        let channel = await ChannelModel.findById(messageRecord.channelId);

        if (!channel)
            return SendError(res, "Invalid channel id!", 401);

        const receiptUser = await UserModel.findById(channel.senderId?.equals(user._id.toString()) ? channel.receiverId : channel.senderId);
        DeleteMessageEvent(receiptUser ? receiptUser.socketIds : [], messageRecord);

        return SendResponse(res, 201, messageRecord, "Message deleted successfully.");
    }
    catch (err: any) {
        return SendError(err?.message);
    }
}

export const AllMessages = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const channelId = req.params.channelId;

        if (!user)
            return null;

        if (!channelId)
            return SendError(res, "Channel id is mandatory!", 401);

        const channel = await ChannelModel.findById(channelId);

        if (!channel)
            return SendError(res, "Invalid channel id!", 401);

        if (!channel.senderId?.equals(user._id.toString()) && !channel.receiverId?.equals(user._id.toString()))
            return SendError(res, "You are not authorised to get all messages!", 401);

        let messages = await MessageModel.find({
            channelId: channelId
        });

        return SendResponse(res, 201, messages);
    }
    catch (err: any) {
        return SendError(err?.message);
    }
}

