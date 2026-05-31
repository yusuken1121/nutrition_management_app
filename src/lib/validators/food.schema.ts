import { z } from "zod"
import { MEAL_TIMES } from "@/core/domain/meal-time.vo"
import {
  NUTRITION_GRAMS_MAX,
  NUTRITION_GRAMS_MIN,
} from "@/core/domain/nutrition.validation"

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const addFoodLogBodySchema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  grams: z
    .number()
    .min(NUTRITION_GRAMS_MIN)
    .max(NUTRITION_GRAMS_MAX),
  mealTime: z.enum(MEAL_TIMES),
  date: z
    .string()
    .regex(dateRegex, "Date must be YYYY-MM-DD")
    .optional(),
})

export const dailySummaryQuerySchema = z.object({
  date: z
    .string()
    .regex(dateRegex, "Date must be YYYY-MM-DD")
    .optional(),
})

export const deficienciesQuerySchema = z.object({
  date: z
    .string()
    .regex(dateRegex, "Date must be YYYY-MM-DD")
    .optional(),
  weightKg: z.coerce.number().min(20).max(300),
})

export type AddFoodLogBody = z.infer<typeof addFoodLogBodySchema>

export const foodEntryFormSchema = z.object({
  foodName: z.string().min(1, "食材名を入力してください"),
  grams: z
    .number()
    .min(NUTRITION_GRAMS_MIN, `${NUTRITION_GRAMS_MIN}g以上`)
    .max(NUTRITION_GRAMS_MAX),
  mealTime: z.enum(MEAL_TIMES),
})

export type FoodEntryFormValues = z.infer<typeof foodEntryFormSchema>
