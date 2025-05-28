import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.handler.middleware";
import { registerScehma, loginSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import {
  googleAuthService,
  loginUserService,
  registerUserService,
} from "../services/auth.service";
import { clear_jwt, setJWT } from "../utils/set-jwt";
import { getFirebaseToken } from "../utils/get-firebase-token";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerScehma.parse({ ...req.body });
    const { userId } = await registerUserService(body);
    await setJWT(res, userId);
    return res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "User created sucessfully" });
  }
);

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse({ ...req.body });
    const { user_id, current_workspace } = await loginUserService(body);
    await setJWT(res, user_id);

    return res.status(HTTPSTATUS.OK).json({
      message: "user login sucessfully",
      user: { user_id, current_workspace },
    });
  }
);

export const googleSignInOrLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email }: { email?: string } = await getFirebaseToken(req);
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for authentication",
      });
    }

    await googleAuthService({ email }, res);
    return res.status(200).json({
      success: true,
      message: "User authenticated successfully",
    });
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    clear_jwt(res);
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);
