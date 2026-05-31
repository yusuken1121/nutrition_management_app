import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { foodApi } from "../food"
import type { AddFoodLogBody } from "@/lib/validators/food.schema"
import type { AddFoodLogResponse } from "@/types/food-api.type"
import { getTodayDateString } from "@/lib/date-utils"

export const foodQueryKeys = {
  all: ["food"] as const,
  dailySummary: (date: string) => ["food", "daily-summary", date] as const,
  deficiencies: (date: string, weightKg: number) =>
    ["food", "deficiencies", date, weightKg] as const,
}

export function useDailySummary(date?: string) {
  const resolvedDate = date ?? getTodayDateString()
  return useQuery({
    queryKey: foodQueryKeys.dailySummary(resolvedDate),
    queryFn: () => foodApi.getDailySummary(resolvedDate),
  })
}

export function useDeficiencies(weightKg: number, date?: string) {
  const resolvedDate = date ?? getTodayDateString()
  return useQuery({
    queryKey: foodQueryKeys.deficiencies(resolvedDate, weightKg),
    queryFn: () => foodApi.getDeficiencies(weightKg, resolvedDate),
    enabled: weightKg > 0,
  })
}

type UseAddFoodLogOptions = UseMutationOptions<
  AddFoodLogResponse,
  Error,
  AddFoodLogBody
>

export function useAddFoodLog(options?: UseAddFoodLogOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: foodApi.addFoodLog,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: foodQueryKeys.all })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}
