import { describe, expect, it } from "vitest"
import { calculateDailyCalories, getUserNutritionGoals } from "./user-goals.entity"

describe("user-goals", () => {
  it("calculates daily calories from weight", () => {
    expect(calculateDailyCalories(65)).toBe(1820)
  })

  it("returns goals object", () => {
    expect(getUserNutritionGoals(70)).toEqual({
      weightKg: 70,
      dailyCalories: 1960,
    })
  })
})
