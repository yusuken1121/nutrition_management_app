import type { CalculatedNutrition } from "../domain/food-nutrition.entity"
import type { FoodLogEntry } from "../domain/food-log-entry.entity"
import type { MealTime } from "../domain/meal-time.vo"
import type { NotionPageRef } from "../domain/notion-page-ref"
import { CalculateNutritionUseCase } from "./calculate-nutrition.use-case"
import type { IFoodDatabase } from "../ports/food-database.port"
import type { INotionRecordWriter } from "../ports/notion-record-writer.port"

export interface AddFoodLogInput {
  foodName: string
  grams: number
  mealTime: MealTime
  date: string
}

export interface AddFoodLogResult {
  page: NotionPageRef
  entry: FoodLogEntry
}

function toFoodLogEntry(
  calculated: CalculatedNutrition,
  input: AddFoodLogInput,
): FoodLogEntry {
  const n = calculated.nutrients
  return {
    foodName: calculated.foodName,
    date: input.date,
    mealTime: input.mealTime,
    grams: calculated.grams,
    calories: n.calories,
    protein: n.protein,
    fat: n.fat,
    carbs: n.carbs,
    vitaminA: n.vitaminA ?? 0,
    vitaminB: n.vitaminB ?? 0,
    vitaminC: n.vitaminC ?? 0,
    vitaminD: n.vitaminD ?? 0,
    vitaminE: n.vitaminE ?? 0,
    calcium: n.calcium ?? 0,
    iron: n.iron ?? 0,
    magnesium: n.magnesium ?? 0,
  }
}

export class AddFoodLogUseCase {
  private readonly calculateNutrition: CalculateNutritionUseCase

  constructor(
    foodDatabase: IFoodDatabase,
    private readonly writer: INotionRecordWriter<FoodLogEntry>,
  ) {
    this.calculateNutrition = new CalculateNutritionUseCase(foodDatabase)
  }

  async execute(input: AddFoodLogInput): Promise<AddFoodLogResult> {
    const calculated = this.calculateNutrition.execute(
      input.foodName,
      input.grams,
    )
    const entry = toFoodLogEntry(calculated, input)
    const page = await this.writer.create(entry)
    return { page, entry }
  }
}
