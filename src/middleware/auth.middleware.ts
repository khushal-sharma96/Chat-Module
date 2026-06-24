import { NextFunction, Request, Response } from 'express';
import { SendError } from '../helpers/response.helper';
import UserModel from '../models/User.model';
import { AuthRequest } from '../interfaces';


export default async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const decodedData = await UserModel.decodeToken(req);
        if (!decodedData)
            return SendError(res, "Unauthorised Access!", 401);

        const user = await UserModel.findById(decodedData._id);
        if (!user) {
            return SendError(res, "User not found!", 401);
        }

        req.user = user;
        next();
    }
    catch (err) {
        return SendError(res, "Unauthorised Access!", 401);
    }
}