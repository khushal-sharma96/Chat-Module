import mongoose, { Model } from "mongoose";
import { Request } from "express";

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId,
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    socketIds: [string];
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