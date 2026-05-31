import { apiClient } from "./apiClient"
import type {
  NutritionCalculateResponse,
  NutritionSearchResponse,
} from "@/types/nutrition-api.type"

export const nutritionApi = {
  searchFoods: async (
    query: string,
    limit?: number,
  ): Promise<NutritionSearchResponse> => {
    const params = new URLSearchParams({ q: query })
    if (limit !== undefined) params.set("limit", String(limit))
    return apiClient.get(`/api/nutrition/search?${params.toString()}`)
  },

  calculateNutrition: async (
    foodName: string,
    grams: number,
  ): Promise<NutritionCalculateResponse> => {
    return apiClient.post("/api/nutrition/calculate", { foodName, grams })
  },
}
