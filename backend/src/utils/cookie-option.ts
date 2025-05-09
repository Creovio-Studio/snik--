import { config } from "../config/app.config"
import {CookieOptions} from "express"
const options = ():CookieOptions => ({  
    httpOnly:true,
    secure:config.NODE_ENV === "producation",
    maxAge: 15 * 60 * 1000,
    sameSite:"strict"
})

export const cookieOptions = options();