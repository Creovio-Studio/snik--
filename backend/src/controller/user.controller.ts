import { asyncHandler } from "../middlewares/async.handler.middleware";
import { Request, Response } from "express";
import { getCurrentUserService } from "../services/user.service";
import { HTTPSTATUS } from "../config/http.config";
export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const { user } = await getCurrentUserService(userId);
    console.log("user fetched:", user);
    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);
