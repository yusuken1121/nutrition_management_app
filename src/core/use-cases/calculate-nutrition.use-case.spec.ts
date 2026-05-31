import { describe, expect, it } from "vitest"
import type { FoodNutrition } from "../domain/food-nutrition.entity"
import { FoodNotFoundError } from "../domain/nutrition.validation"
import { CalculateNutritionUseCase } from "./calculate-nutrition.use-case"
import type { IFoodDatabase } from "../ports/food-database.port"

const sampleFood: FoodNutrition = {
  name: "卵（全卵）",
  per100g: {
    calories: 151,
    protein: 12.3,
    fat: 10.3,
    carbs: 0.3,
    iron: 2.2,
  },
}

function createMockDatabase(foods: FoodNutrition[]): IFoodDatabase {
  return {
    searchFood: () => foods,
    findByName: (name) =>
      foods.find((f) => f.name === name) ?? null,
  }
}

describe("CalculateNutritionUseCase", () => {
  it("scales nutrients by grams", () => {
    const useCase = new CalculateNutritionUseCase(
      createMockDatabase([sampleFood]),
    )

    const result = useCase.execute("卵（全卵）", 50)

    expect(result.foodName).toBe("卵（全卵）")
    expect(result.grams).toBe(50)
    expect(result.nutrients.calories).toBe(76)
    expect(result.nutrients.protein).toBe(6.15)
    expect(result.nutrients.iron).toBe(1.1)
  })

  it("throws when food is not found", () => {
    const useCase = new CalculateNutritionUseCase(createMockDatabase([]))

    expect(() => useCase.execute("存在しない食材", 100)).toThrow(
      FoodNotFoundError,
    )
  })

  it("rejects invalid grams", () => {
    const useCase = new CalculateNutritionUseCase(
      createMockDatabase([sampleFood]),
    )

    expect(() => useCase.execute("卵（全卵）", 0)).toThrow()
  })
})
