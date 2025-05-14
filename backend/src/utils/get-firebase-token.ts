import { Request } from "express";
import { AppError, BadRequestException } from "./app-error";
import fbAdmin from "./firebase.admin";

export async function getFirebaseToken(req: Request) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken)
    throw new BadRequestException("Unauthorized: No token provided");
  try {
    const decodedToken = await fbAdmin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new AppError("Authorized: Invalid Token");
  }
}
