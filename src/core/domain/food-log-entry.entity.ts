import type { MealTime } from "./meal-time.vo"

/** Record persisted to Notion Food Log database */
export interface FoodLogEntry {
  foodName: string
  date: string
  mealTime: MealTime
  grams: number
  calories: number
  protein: number
  fat: number
  carbs: number
  vitaminA: number
  vitaminB: number
  vitaminC: number
  vitaminD: number
  vitaminE: number
  calcium: number
  iron: number
  magnesium: number
}

export interface FoodLogEntryWithId extends FoodLogEntry {
  id: string
}

export interface DailyNutrientTotals {
  calories: number
  protein: number
  fat: number
  carbs: number
  vitaminA: number
  vitaminB: number
  vitaminC: number
  vitaminD: number
  vitaminE: number
  calcium: number
  iron: number
  magnesium: number
}

export interface DailySummary {
  date: string
  entries: FoodLogEntryWithId[]
  totals: DailyNutrientTotals
  byMealTime: Record<MealTime, FoodLogEntryWithId[]>
}

export function createEmptyDailyTotals(): DailyNutrientTotals {
  return {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    vitaminA: 0,
    vitaminB: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0,
    calcium: 0,
    iron: 0,
    magnesium: 0,
  }
}

export function aggregateDailyTotals(
  entries: FoodLogEntry[],
): DailyNutrientTotals {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: round(acc.protein + entry.protein),
      fat: round(acc.fat + entry.fat),
      carbs: round(acc.carbs + entry.carbs),
      vitaminA: round(acc.vitaminA + entry.vitaminA),
      vitaminB: round(acc.vitaminB + entry.vitaminB),
      vitaminC: round(acc.vitaminC + entry.vitaminC),
      vitaminD: round(acc.vitaminD + entry.vitaminD),
      vitaminE: round(acc.vitaminE + entry.vitaminE),
      calcium: round(acc.calcium + entry.calcium),
      iron: round(acc.iron + entry.iron),
      magnesium: round(acc.magnesium + entry.magnesium),
    }),
    createEmptyDailyTotals(),
  )
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}
