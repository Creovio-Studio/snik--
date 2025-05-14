import { Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";
import { cookieOptions } from "./cookie-option";

export function setJWT(res: Response, value: string) {
  const token = jwt.sign({ userId: value }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
  return res.cookie("user_token", token, cookieOptions);
}

export function clear_jwt(res: Response) {
  return res.clearCookie("user_token", cookieOptions);
}
