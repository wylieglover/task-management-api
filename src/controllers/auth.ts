import { prisma } from "../lib/prisma.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET env var");

export const register = asyncHandler(async(req, res, _next) => {
    const { email, password } = req.body;

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
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return res.status(201).json({user, token })
});

export const login = asyncHandler(async(req, res, _next) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
    }

    const passwordCheck = await bcrypt.compare(password, user.passwordHash);

    if(!passwordCheck) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { sub: String(user.id), email: user.email },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return res.status(201).json({ message: user.email, token });
}); 