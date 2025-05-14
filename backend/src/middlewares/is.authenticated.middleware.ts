import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/app-error";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { user_token } = req.cookies;

  if (!user_token) {
    return next(new UnauthorizedException("Unauthorized. Please log in."));
  }

  try {
    const decoded = jwt.verify(user_token, config.JWT_SECRET) as {
      userId: string;
    };
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new UnauthorizedException("Invalid or expired token."));
  }
};

export default isAuthenticated;
