import express, { Request, Response } from "express";
import AuthController from "../controllers/auth.controller"
const route = express.Router();

route.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ status: true, message: "Hello from the server!" });
});

/**
 * Signup Route
 */
route.post("/signup", AuthController.SignUp);

/**
 * Signup Route
 */
route.post("/login", AuthController.Login);


// module.exports = route;
export default route;