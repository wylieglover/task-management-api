import express from 'express';
import { register, login } from '../controllers/auth.js';
import { validate } from '../middlewares/validate.js';
import { authSchema } from '../schemas/user.js';

const authRouter = express.Router();

authRouter.post('/register', validate({ body: authSchema }), register);
authRouter.post('/login', validate({ body: authSchema }), login);

export { authRouter };