import { useMutation, useQuery } from "@tanstack/react-query"
import { nutritionApi } from "../nutrition"

export const nutritionQueryKeys = {
  search: (query: string, limit?: number) =>
    ["nutrition", "search", query, limit] as const,
}

export function useSearchFood(query: string, limit?: number) {
  return useQuery({
    queryKey: nutritionQueryKeys.search(query, limit),
    queryFn: () => nutritionApi.searchFoods(query, limit),
    enabled: query.trim().length > 0,
  })
}

export function useCalculateNutrition() {
  return useMutation({
    mutationFn: ({
      foodName,
      grams,
    }: {
      foodName: string
      grams: number
    }) => nutritionApi.calculateNutrition(foodName, grams),
  })
}
