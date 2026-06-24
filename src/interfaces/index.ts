import mongoose, { Model } from "mongoose";
import { Request } from "express";

export interface IUser {
    _id: mongoose.Types.ObjectId,
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    socketIds: string[];
}

export interface IUserMethods {
    generateAuthToken(): Promise<string>;
    comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser, {}, IUserMethods> {
    hashPassword(password: string): Promise<string>;
    decodeToken(req: Request): Promise<any>;
}

export interface AuthRequest extends Request {
    user?: IUser;
}

export interface IMessage {
    channelId: mongoose.Types.ObjectId | null;
    body: string | null;
    replyId: mongoose.Types.ObjectId | null;
    isEdited: boolean | null;
    isDocument: boolean | null;
    links: string[];
    isLink: boolean | null;
    seenBy: mongoose.Types.ObjectId[];
    sentby: mongoose.Types.ObjectId | null;
    deletedAt?: string | null;
}

export interface MessageDTO {
  channelId: string | null;
  replyId: string | null;
  sentby: string | null;
  seenBy: string[];
  links: string[];
  body: string | null;
  isEdited: boolean | null;
  isDocument: boolean | null;
  isLink: boolean | null;
  deletedAt?: string | null;
}