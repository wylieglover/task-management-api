import { rateLimit } from "express-rate-limit"

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many login attempts, please try again later"
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many register attempts, please try again later"
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  
    limit: 20,             
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many refresh attempts, please try again later"
});