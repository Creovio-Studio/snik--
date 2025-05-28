import { config } from "../config/app.config";
import { AppError } from "./app-error";

export async function getEmailName(email: string) {
  return email.split("@")[0];
}
