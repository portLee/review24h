import { SessionOptions } from "iron-session";

export interface SessionData {
    id?: number;
    username?: string;
    isLoggedIn: boolean;
    cookie: string;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    cookie: ""
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: "baemin-session",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}