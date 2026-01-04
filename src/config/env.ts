const validateEnv = (): {
    PORT: string;
    NODE_ENV: string;
    JWT_SECRET: string;
    JWT_ACCESS_EXPIRY: number;
    JWT_REFRESH_EXPIRY: number;
    REDIS_HOST: string;
    REDIS_PORT: number;
} => {
    const { JWT_SECRET, PORT, NODE_ENV, REDIS_HOST, REDIS_PORT } = process.env;

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    if (REDIS_PORT && isNaN(Number(REDIS_PORT))) {
        console.warn(`Invalid REDIS_PORT '${REDIS_PORT}', using default 6379`);
    }

    const JWT_ACCESS_EXPIRY = NODE_ENV === "development"
        ? 5 * 60 * 60    // 5 hours in dev
        : 15 * 60;       // 15 minutes in prod

    const JWT_REFRESH_EXPIRY = 7 * 24 * 60 * 60; 

    return {
        PORT: PORT || "3000",
        NODE_ENV: NODE_ENV || "development",
        JWT_SECRET,
        JWT_ACCESS_EXPIRY,
        JWT_REFRESH_EXPIRY,
        REDIS_HOST: REDIS_HOST || "localhost",
        REDIS_PORT: REDIS_PORT ? parseInt(REDIS_PORT, 10) : 6379
    };
};

export const env = validateEnv();