import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config/app.config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import isAuthenticated from "./middlewares/is.authenticated.middleware";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({ origin: config.FRONTEND_ORIGIN, credentials: true }));
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.listen(config.PORT, () => {
  console.log("=================================================");
  console.log(`            http://localhost:${config.PORT}          `);
  console.log("=================================================");
});
