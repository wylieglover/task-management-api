
import { RequestHandler } from "express"
import jwt from "jsonwebtoken";
import { env } from '../config/env.js'; 

export const authenticate: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = auth.slice("Bearer ".length);
  
  try { 
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Invalid user id in token" });
    }
    
    res.locals.userId = userId;
    
    return next();
  } catch (err: unknown) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};