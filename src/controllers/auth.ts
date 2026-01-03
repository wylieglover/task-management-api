import { env } from '../config/env.js';
import { prisma } from "../lib/prisma.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

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

    const token = jwt.sign(
        { sub: String(user.id), email: user.email },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRY }
    );

    return res.status(201).json({ user, token })
});

export const login = asyncHandler(async(_req, res, _next) => {
    const { email, password } = res.locals.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordCheck = await bcrypt.compare(password, user.passwordHash);

    if(!passwordCheck) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { sub: String(user.id) },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRY }
    );

    return res.status(200).json({ email: user.email, token });
}); 