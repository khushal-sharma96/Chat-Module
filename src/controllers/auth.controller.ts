import { Request, Response } from "express";
import UserModel from "../models/User.model";
import { SendResponse, SendError } from "../helpers/response.helper"
const SignUp = async (req: Request, res: Response) => {
    try {
        let {
            firstname,
            lastname,
            password,
            email
        } = req.body;

        password = await UserModel.hashPassword(password);

        const user = await UserModel.create({
            firstname,
            lastname,
            password,
            email
        });
        return SendResponse(res, 200, user);

    }
    catch (err: any) {
        return SendError(res, err?.message);
    }
}

const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const isValidPassword = await user.comparePassword(password);
            if (isValidPassword) {
                return SendResponse(res, 200, { userData: user, token: user.generateAuthToken() });
            }
        }
        return SendError(res, "Invalid email or password!", 401);
    }
    catch (err: any) {
        return SendError(res, err?.message);
    }
}

export default {
    SignUp, Login
}