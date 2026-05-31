import { z } from "zod"
import type {
  FoodSuggestionsResult,
  MealPlanResult,
} from "./nutrition-suggestion.entity"

const foodSuggestionItemSchema = z.object({
  name: z.string(),
  nutrients: z.string(),
  amount: z.string(),
})

const foodSuggestionsSchema = z.object({
  suggestions: z.array(foodSuggestionItemSchema).min(1),
})

const mealPlanMealSchema = z.object({
  mealTime: z.string(),
  description: z.string(),
  foods: z.array(z.string()).min(1),
})

const mealPlanSchema = z.object({
  breakfast: mealPlanMealSchema,
  lunch: mealPlanMealSchema,
  dinner: mealPlanMealSchema,
})

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced?.[1]) return fenced[1].trim()

  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start >= 0 && end > start) return text.slice(start, end + 1)

  return text.trim()
}

export class NutritionAiParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NutritionAiParseError"
  }
}

export function parseFoodSuggestionsResponse(
  raw: string,
): FoodSuggestionsResult {
  try {
    const parsed = JSON.parse(extractJson(raw))
    return foodSuggestionsSchema.parse(parsed)
  } catch {
    throw new NutritionAiParseError("Failed to parse food suggestions from AI")
  }
}

export function parseMealPlanResponse(raw: string): MealPlanResult {
  try {
    const parsed = JSON.parse(extractJson(raw))
    return mealPlanSchema.parse(parsed)
  } catch {
    throw new NutritionAiParseError("Failed to parse meal plan from AI")
  }
}
