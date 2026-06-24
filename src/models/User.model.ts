import mongoose from "mongoose";
import jwt,{Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request } from "express";
import { IUser, IUserMethods, IUserModel } from "../interfaces";
const Schema = new mongoose.Schema<
    IUser,
    IUserMethods,
    IUserModel
>({
    firstname: {
        type: String,
        required: true,
        minlength: 3,
    },
    lastname: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
}, {
    timestamps: true
});

Schema.methods.generateAuthToken = async function () {
    const jwtSecret: string = process.env.JWT_STRING as string;
    return jwt.sign({ _id: this._id, firstname: this.firstname, lastname: this.lastname, email: this.email }, jwtSecret);
};

Schema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

Schema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

Schema.statics.decodeToken = async (req: Request) => {
    const token = req?.cookies?.token || req.headers.authorization;
    if (!token)
        return false;
    try {
        return jwt.verify(token, process.env.JWT_STRING as string);
    }
    catch (err) {
        throw err;
    }
}

export default mongoose.model<IUser, IUserModel>("User", Schema);