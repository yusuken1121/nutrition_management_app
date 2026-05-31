import type { DeficienciesResult } from "@/core/use-cases/get-deficiencies.use-case"
import type { AddFoodLogResult } from "@/core/use-cases/add-food-log.use-case"
import type { DailySummary } from "@/core/domain/food-log-entry.entity"

export interface AddFoodLogResponse {
  success: true
  data: AddFoodLogResult
}

export interface DailySummaryResponse {
  summary: DailySummary
}

export interface DeficienciesResponse {
  data: DeficienciesResult
}
