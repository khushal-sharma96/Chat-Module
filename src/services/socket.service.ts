import { NextFunction } from "express";
import { Server, Socket, ExtendedError } from "socket.io";
import jwt from "jsonwebtoken"

let io;

export default (server: any) => {
    io = new Server(server);

    io.use((socket: any, next: (err?: ExtendedError) => void) => {

        if (socket.handshake.headers && socket.handshake.headers.authorization) {
            jwt.verify(
                socket.handshake.headers.authorization,
                process.env.JWT_SECRET_KEY as string,
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
        const userId = user.id;

        socket.on('ONLINE', async () => {
            console.log("User is online now!", user);
        })

        socket.on('disconnect', () => {
            console.log('User  disconnected', user);
        });
    });
} 