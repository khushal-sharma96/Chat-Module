import { Server } from "socket.io";

let io;

export default (server: any) => {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('ONLINE', async (payload) => {
            console.log("User is online now!", payload);
        })

        socket.on('disconnect', () => {
            console.log('User  disconnected');
        });
    });
} 