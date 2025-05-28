import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  googleSignInOrLogin,
} from "../controller/auth.controller";
const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/google", googleSignInOrLogin);
authRoutes.post("/login", loginUserController);

export default authRoutes;
