import express, { Request, Response } from "express";
import AuthRoutes from "./routes/auth.routes"
import DbConfig from "./config/db.config"
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


const app = express();

app.use(express.json());
app.use(express.json());
app.use(cors());

DbConfig();

app.use("/auth", AuthRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        status: true,
        message: "Hello from the server!"
    });
});

export default app;

