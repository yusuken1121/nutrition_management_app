import { apiClient } from "./apiClient"
import type { FoodSuggestionsResult } from "@/core/domain/nutrition-suggestion.entity"
import type { MealPlanResult } from "@/core/domain/nutrition-suggestion.entity"
import type { AiNutritionRequest } from "@/lib/validators/ai-nutrition.schema"

export const aiNutritionApi = {
  suggestFoods: async (
    data: AiNutritionRequest,
  ): Promise<FoodSuggestionsResult> => {
    return apiClient.post("/api/ai/suggest-foods", data)
  },

  suggestMealPlan: async (
    data: AiNutritionRequest,
  ): Promise<{ mealPlan: MealPlanResult }> => {
    return apiClient.post("/api/ai/meal-plan", data)
  },
}
