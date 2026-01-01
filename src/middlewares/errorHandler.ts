import type { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/httpErrors.js";
import { Prisma } from "../generated/prisma/client.js";
import { z } from 'zod';

export const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message });
    }

    // @TODO Why do I even check for prisma errors in my serialization (errorHandler)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2025":
                return res.status(404).json({ message: "Record not found" });
            case "P2002":
                return res.status(404).json({ message: "Record in use already" });
            default:
                return res.status(400).json({ message: "Database error" });
        }
    }

    if (err instanceof z.ZodError) {
        const errors = err.issues.map((issue) => ({
            code: issue.code,
            message: issue.message,
            ...(issue.code === "unrecognized_keys"
                ? { keys: (issue as any).keys }
                : {}),
        }));
        
        return res.status(400).json({
            message: "Validation failed",
            errors,
        });
    }

    if (process.env.NODE_ENV !== "production") {
        console.error("Middleware: ", err);
    }

    return res.status(500).json({ message: "Internal server error" });
};