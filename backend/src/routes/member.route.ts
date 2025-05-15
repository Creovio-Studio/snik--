import { Router } from "express";
import { joinWorkSpaceController } from "../controller/member.controller";
const memberRoutes = Router();

memberRoutes.post("/workspace/:inviteCode/join", joinWorkSpaceController);

export default memberRoutes;
