
import { z } from "zod";

export const authSchema = z.strictObject({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(8).max(72)
});
