import type { FoodLogEntryWithId } from "../domain/food-log-entry.entity"

export interface IFoodLogReader {
  queryByDate(date: string): Promise<FoodLogEntryWithId[]>
}
