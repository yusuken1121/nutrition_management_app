import {
  calculateDeficiencies,
  type NutrientDeficiency,
} from "../domain/deficiency.entity"
import type { DailySummary } from "../domain/food-log-entry.entity"
import { GetDailySummaryUseCase } from "./get-daily-summary.use-case"
import type { IFoodLogReader } from "../ports/food-log-reader.port"

export interface DeficienciesResult {
  date: string
  weightKg: number
  summary: DailySummary
  deficiencies: NutrientDeficiency[]
}

export class GetDeficienciesUseCase {
  private readonly getDailySummary: GetDailySummaryUseCase

  constructor(reader: IFoodLogReader) {
    this.getDailySummary = new GetDailySummaryUseCase(reader)
  }

  async execute(date: string, weightKg: number): Promise<DeficienciesResult> {
    const summary = await this.getDailySummary.execute(date)
    const deficiencies = calculateDeficiencies(weightKg, summary.totals)

    return {
      date,
      weightKg,
      summary,
      deficiencies,
    }
  }
}
