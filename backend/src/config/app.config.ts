import {getEnv} from "../utils/get-env.ts"

const appConfig = () => ({
    NODE_ENV:getEnv("NODE_ENV", "development"),
    PORT:getEnv("PORT", "5000"),
    BASE_PATH:getEnv("BSAE_PATH", "/api"),
    DATABASE_URL: getEnv("DATABASE_URL"),
    
    SESSION_SECRET:getEnv("SESSION_SECRET"),
    SESSION_EXPIRES_IN:getEnv("SESSION_EXPIRES_IN"),

    FRONTEND_ORIGIN:getEnv("FRONTEND_ORIGIN", "localhost"),
})

export const config = appConfig();