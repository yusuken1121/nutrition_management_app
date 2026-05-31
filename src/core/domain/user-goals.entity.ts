/** Simplified daily calorie target (BMR × activity factor approximation) */
export function calculateDailyCalories(weightKg: number): number {
  return Math.round(weightKg * 28)
}

export interface UserNutritionGoals {
  weightKg: number
  dailyCalories: number
}

export function getUserNutritionGoals(weightKg: number): UserNutritionGoals {
  return {
    weightKg,
    dailyCalories: calculateDailyCalories(weightKg),
  }
}
