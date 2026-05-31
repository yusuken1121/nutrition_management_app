import { describe, expect, it } from "vitest"
import { calculateDeficiencies } from "./deficiency.entity"
import { createEmptyDailyTotals } from "./food-log-entry.entity"

describe("calculateDeficiencies", () => {
  it("marks nutrients below 70% as critical", () => {
    const intake = {
      ...createEmptyDailyTotals(),
      vitaminC: 30,
    }

    const result = calculateDeficiencies(65, intake)
    const vitaminC = result.find((d) => d.nutrient === "ビタミンC")

    expect(vitaminC?.achievementPercentage).toBe(30)
    expect(vitaminC?.severity).toBe("critical")
  })

  it("marks nutrients at or above 100% as ok", () => {
    const intake = {
      ...createEmptyDailyTotals(),
      calories: 2000,
      protein: 100,
      fat: 60,
      carbs: 300,
      vitaminA: 900,
      vitaminB: 2,
      vitaminC: 120,
      vitaminD: 10,
      vitaminE: 7,
      calcium: 900,
      iron: 8,
      magnesium: 400,
    }

    const result = calculateDeficiencies(65, intake)
    expect(result.every((d) => d.severity === "ok")).toBe(true)
  })
})
