import { z } from "zod"

export const aiNutritionRequestSchema = z.object({
  weightKg: z.coerce.number().min(20).max(300),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
})

export type AiNutritionRequest = z.infer<typeof aiNutritionRequestSchema>
