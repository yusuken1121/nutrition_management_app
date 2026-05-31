export const MEAL_TIMES = ["朝食", "昼食", "夕食", "間食"] as const

export type MealTime = (typeof MEAL_TIMES)[number]

export function isMealTime(value: string): value is MealTime {
  return (MEAL_TIMES as readonly string[]).includes(value)
}
