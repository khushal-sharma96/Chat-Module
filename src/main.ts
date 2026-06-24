import express, { Request, Response } from "express";
import AuthRoutes from "./routes/auth.routes"
import MessageRouter from "./routes/message.route"
import DbConfig from "./config/db.config"
import cors from "cors";
import dotenv from "dotenv";
import Socket from "./services/socket.service"
import http from "http";
dotenv.config();


const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.json());
app.use(cors());

DbConfig();
Socket(server);

app.use("/", MessageRouter);
app.use("/auth", AuthRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        status: true,
        message: "Hello from the chat-server(Build by Khushal Sharma)!"
    });
});

export default server;

