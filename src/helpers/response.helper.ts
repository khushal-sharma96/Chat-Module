import { Response } from "express"

export const SendResponse = (res: Response, statusCode: number = 200, responseData: any, message: any = "") => {
    return res.status(statusCode).json({
        status: true,
        data: responseData,
        message
    });
}

export const SendError = (res: Response, message: String = "Something went wrong!", statusCode: number = 500, responseData: any = null) => {
    console.log("Server side error: ", responseData, message);
    return res.status(statusCode).json({
        message,
    });
}