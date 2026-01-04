import { env } from "../config/env.js"
import { badRequest, notFound } from "../errors/httpErrors.js"
import { prisma } from "../lib/prisma.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { redis } from "../lib/redis.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = asyncHandler(async(_req, res, _next) => {
    const { email, password } = res.locals.body;

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash
        },
        select: { id: true, email: true, createdAt: true }
    });

    const accessToken = jwt.sign(
        { sub: String(user.id) },
        env.JWT_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { sub: String(user.id) },
        env.JWT_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRY }
    );

    await redis.setex(
        `refresh:${user.id}`,
        env.JWT_REFRESH_EXPIRY,
        refreshToken
    )

    return res.status(201).json({ user, accessToken, refreshToken });
});

export const login = asyncHandler(async(_req, res, _next) => {
    const { email, password } = res.locals.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw notFound("Invalid credentials");
    }

    const passwordCheck = await bcrypt.compare(password, user.passwordHash);

    if(!passwordCheck) {
        throw badRequest("Invalid credentials");
    }

    const accessToken = jwt.sign(
        { sub: String(user.id) },
        env.JWT_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { sub: String(user.id) },
        env.JWT_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRY }
    );

    await redis.setex(
        `refresh:${user.id}`,
        env.JWT_REFRESH_EXPIRY,
        refreshToken
    );

    return res.status(200).json({ email: user.email, accessToken, refreshToken });
});

export const refreshToken = asyncHandler(async(req, res, next) => {
    const { refreshToken } = res.locals.body;

    const decoded = jwt.verify(refreshToken, env.JWT_SECRET);
    
    const userId = Number(decoded.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
        throw badRequest("Invalid user id in token");
    }

    const redisToken = await redis.get(`refresh:${userId}`);
    if (!redisToken || redisToken !== refreshToken) {
       throw badRequest("Invalid or expired refresh token");
    }
    await redis.del(`refresh:${userId}`);

    const accessToken = jwt.sign(
        { sub: String(userId) },
        env.JWT_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
        { sub: String(userId) },
        env.JWT_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRY }
    );

    await redis.setex(
        `refresh:${userId}`,
        env.JWT_REFRESH_EXPIRY,
        newRefreshToken
    );

    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
});
