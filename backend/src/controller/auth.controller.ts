import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.handler.middleware";
import { registerScehma } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import {registerUserService} from "../services/auth.service"
import { setJWT } from "../utils/set-jwt";
export const registerUserController = asyncHandler(async (req:Request, res:Response) => {
    const body = registerScehma.parse({...req.body});
    const { userId } = await registerUserService(body);
    await setJWT(req, userId);
    return res.status(HTTPSTATUS.CREATED).json({message:"User created sucessfully"})
})