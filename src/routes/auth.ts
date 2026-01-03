import express from 'express';
import { register, login } from '../controllers/auth.js';
import { registerLimiter, loginLimiter } from '../middlewares/rateLimit.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/auth.js';

const authRouter = express.Router();

authRouter.post('/register', registerLimiter, validate({ body: registerSchema }), register);
authRouter.post('/login', loginLimiter, validate({ body: loginSchema }), login);

export { authRouter };