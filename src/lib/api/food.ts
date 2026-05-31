import { apiClient } from "./apiClient"
import type {
  AddFoodLogResponse,
  DailySummaryResponse,
  DeficienciesResponse,
} from "@/types/food-api.type"
import type { AddFoodLogBody } from "@/lib/validators/food.schema"

export const foodApi = {
  addFoodLog: async (data: AddFoodLogBody): Promise<AddFoodLogResponse> => {
    return apiClient.post("/api/food/add", data)
  },

  getDailySummary: async (date?: string): Promise<DailySummaryResponse> => {
    const params = date ? `?date=${encodeURIComponent(date)}` : ""
    return apiClient.get(`/api/daily-summary${params}`)
  },

  getDeficiencies: async (
    weightKg: number,
    date?: string,
  ): Promise<DeficienciesResponse> => {
    const params = new URLSearchParams({ weightKg: String(weightKg) })
    if (date) params.set("date", date)
    return apiClient.get(`/api/deficiencies?${params.toString()}`)
  },
}
