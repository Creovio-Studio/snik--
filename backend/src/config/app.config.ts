import { getEnv } from "../utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BSAE_PATH", "/api"),
  DATABASE_URL: getEnv("DATABASE_URL"),

  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
  RANDOMERR_API_KEY: getEnv("RANDOMERR_API_KEY"),
});

export const config = appConfig();
