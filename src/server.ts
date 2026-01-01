import 'dotenv/config';
import express from 'express';
import { itemRouter } from './routes/item.js';
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/item', itemRouter);
app.use(errorHandler);

app.listen(PORT, function() {
    console.log(`App listening on ${PORT}`);
});


