const validateEnv = (): {
    PORT: string;
    NODE_ENV: string;
    JWT_SECRET: string;
    JWT_EXPIRY: number;
} => {
    const { JWT_SECRET, PORT, NODE_ENV} = process.env;

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const JWT_EXPIRY = NODE_ENV === 'development'
        ? 5 * 60 * 60    // 5 hours in development
        : 15 * 60;       // 15 minutes in production

    return {
        PORT: PORT || '3000',
        NODE_ENV: NODE_ENV || 'development',
        JWT_SECRET,
        JWT_EXPIRY
    };
};

export const env = validateEnv();