import { MEAL_TIMES, type MealTime } from "../domain/meal-time.vo"
import {
  aggregateDailyTotals,
  type DailySummary,
  type FoodLogEntryWithId,
} from "../domain/food-log-entry.entity"
import type { IFoodLogReader } from "../ports/food-log-reader.port"

function groupByMealTime(
  entries: FoodLogEntryWithId[],
): Record<MealTime, FoodLogEntryWithId[]> {
  const grouped = Object.fromEntries(
    MEAL_TIMES.map((meal) => [meal, [] as FoodLogEntryWithId[]]),
  ) as Record<MealTime, FoodLogEntryWithId[]>

  for (const entry of entries) {
    grouped[entry.mealTime].push(entry)
  }

  return grouped
}

export class GetDailySummaryUseCase {
  constructor(private readonly reader: IFoodLogReader) {}

  async execute(date: string): Promise<DailySummary> {
    const entries = await this.reader.queryByDate(date)

    return {
      date,
      entries,
      totals: aggregateDailyTotals(entries),
      byMealTime: groupByMealTime(entries),
    }
  }
}
