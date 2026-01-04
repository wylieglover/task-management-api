import express from "express"
import { register, login, refreshToken } from "../controllers/auth.js"
import { registerLimiter, loginLimiter, refreshLimiter } from "../middlewares/rateLimit.js"
import { validate } from "../middlewares/validate.js"
import { registerSchema, loginSchema, refreshTokenSchema } from "../schemas/auth.js"

const authRouter = express.Router();

authRouter.post("/register", registerLimiter, validate({ body: registerSchema }), register);
authRouter.post("/login", loginLimiter, validate({ body: loginSchema }), login);
authRouter.post("/refresh", refreshLimiter, validate({ body: refreshTokenSchema }), refreshToken);

export { authRouter };