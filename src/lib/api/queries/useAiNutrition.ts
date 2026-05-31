import { useMutation } from "@tanstack/react-query"
import { aiNutritionApi } from "../ai-nutrition"
import type { AiNutritionRequest } from "@/lib/validators/ai-nutrition.schema"

export function useSuggestFoods() {
  return useMutation({
    mutationFn: (data: AiNutritionRequest) => aiNutritionApi.suggestFoods(data),
  })
}

export function useSuggestMealPlan() {
  return useMutation({
    mutationFn: (data: AiNutritionRequest) => aiNutritionApi.suggestMealPlan(data),
  })
}
