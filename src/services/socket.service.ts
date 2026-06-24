import { NextFunction } from "express";
import { Server, Socket, ExtendedError } from "socket.io";
import jwt from "jsonwebtoken"
import { saveSocketId } from "../models/User.model";
import { IMessage } from "../interfaces";

let io: any;

export default (server: any) => {
    io = new Server(server);

    io.use((socket: any, next: (err?: ExtendedError) => void) => {
        if (socket.handshake.headers && socket.handshake.headers.authorization) {
            jwt.verify(
                socket.handshake.headers.authorization,
                process.env.JWT_STRING as string,
                function (err: any, decoded: any) {
                    if (err) return next(new Error("Authentication error"));
                    socket.decoded = decoded;
                    next();
                },
            );
        } else {
            next(new Error("Authentication error"));
        }
    });


    io.on('connection', (socket: any) => {
        const user = socket.decoded.user;

        socket.on('ONLINE', async (payload: any) => {
            console.log("User is online now!", user);
            saveSocketId(payload.socketId, user._id);
        })

        socket.on('disconnect', () => {
            console.log('User  disconnected', user);
        });
    });
}


export const SocketInstance = io;

export const SendMessageEvent = (socketIds: string[], message: any) => {
    socketIds.forEach((socketId: string) => {
        io.to(socketId).emit("SENT_MESSAGE", message);
    })
};

export const DeleteMessageEvent = (socketIds: string[], message: any) => {
    socketIds.forEach((socketId: string) => {
        io.to(socketId).emit("DELETE_MESSAGE", message);
    })
};

export const SeenMessageEvent = (socketIds: string[], message: any) => {
    socketIds.forEach((socketId: string) => {
        io.to(socketId).emit("SEEN_MESSAGE", message);
    })
};