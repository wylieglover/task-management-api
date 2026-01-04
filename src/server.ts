import "dotenv/config"
import { env } from "./config/env.js"

import express from "express"
import { itemRouter } from "./routes/item.js"
import { authRouter } from "./routes/auth.js"
import { apiLimiter } from "./middlewares/rateLimit.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const app = express();

app.use(express.json());
app.use("/api", apiLimiter);
app.use("/api/auth", authRouter);
app.use("/api/item", itemRouter);
app.use(errorHandler);

app.listen(env.PORT, function() {
    console.log(`App listening on ${env.PORT}`);
});


