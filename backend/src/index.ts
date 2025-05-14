import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import { HTTPSTATUS } from "./config/http.config";
import cookieParser from "cookie-parser";
import { getEnv } from "./utils/get-env";
import { asyncHandler } from "./middlewares/async.handler.middleware";
import { generateInviteCode } from "./utils/uuid";
import { cookieOptions } from "./utils/cookie-option";
import authRoutes from "./routes/auth.route";
import isAuthenticated from "./middlewares/is.authenticated.middleware";
const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({ origin: config.FRONTEND_ORIGIN }));
app.use("/auth", authRoutes);

app.get("/", isAuthenticated, (req: Request, res: Response): void => {
  res.json({ userId: req.body.userId });
});

app.listen(config.PORT, () => {
  console.log("=================================================");
  console.log(`            http://localhost:${config.PORT}          `);
  console.log("=================================================");
});
