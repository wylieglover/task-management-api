import { z } from "zod"

export const createItemSchema = z.strictObject({
  description: z.string().trim().min(1)
});

export const getItemsSchema = z.strictObject({
  completed: z.preprocess(
    (v) => {
      if (typeof v === "string") return v.trim().toLowerCase()
      return v;
    },
    z.enum(["true", "false"]).transform((v) => v === "true")
  ).optional()
});

export const itemParamsSchema = z.object({
  id: z.string().trim().regex(/^\d+$/)
    .transform((val) => parseInt(val, 10))
    .refine(
      (n) => n > 0 && n <= Number.MAX_SAFE_INTEGER,
      { error: `ID must be a positive integer <= ${Number.MAX_SAFE_INTEGER}` }
    ),
});

export const updateItemSchema = z.strictObject({  
  description: z.string().trim().min(1).optional(),
  completed: z.boolean().optional()
}).refine(
  (data) => data.description !== undefined || data.completed !== undefined,
  { error: "Provide at least one of: description, completed" }
);
