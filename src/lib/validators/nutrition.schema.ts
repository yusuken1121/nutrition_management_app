import { z } from "zod"
import {
  NUTRITION_GRAMS_MAX,
  NUTRITION_GRAMS_MIN,
} from "@/core/domain/nutrition.validation"

export const nutritionSearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export const calculateNutritionBodySchema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  grams: z
    .number()
    .min(NUTRITION_GRAMS_MIN)
    .max(NUTRITION_GRAMS_MAX),
})
