import { z } from 'zod'


// Zod throws an error message for an exact field, look it up later
export const createItemSchema = z.strictObject({
  description: z.string()
});

export const getItemsSchema = z.strictObject({
  completed: z.string()
    .transform(val => val.toLowerCase() === "true")
    .optional()
});

export const itemParamsSchema = z.object({
  id: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val), { message: "ID must be a number" })
});

export const updateItemSchema = z.strictObject({  
  description: z.string().optional(),
  completed: z.boolean().optional()
});
