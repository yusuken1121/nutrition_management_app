import { describe, expect, it } from "vitest"
import type { FoodNutrition } from "@/core/domain/food-nutrition.entity"
import { findFoodByName, searchFoods } from "./food-search.util"

const foods: FoodNutrition[] = [
  {
    name: "白米（精白米）",
    nameEn: "White rice",
    aliases: ["ごはん"],
    per100g: { calories: 168, protein: 2.5, fat: 0.3, carbs: 37.1 },
  },
  {
    name: "卵（全卵）",
    nameEn: "Egg",
    aliases: ["たまご"],
    per100g: { calories: 151, protein: 12.3, fat: 10.3, carbs: 0.3 },
  },
]

describe("searchFoods", () => {
  it("matches Japanese name", () => {
    const results = searchFoods(foods, "白米")
    expect(results[0]?.name).toBe("白米（精白米）")
  })

  it("matches alias", () => {
    const results = searchFoods(foods, "たまご")
    expect(results[0]?.name).toBe("卵（全卵）")
  })

  it("matches English name", () => {
    const results = searchFoods(foods, "egg")
    expect(results[0]?.name).toBe("卵（全卵）")
  })
})

describe("findFoodByName", () => {
  it("finds by exact Japanese name", () => {
    expect(findFoodByName(foods, "卵（全卵）")?.name).toBe("卵（全卵）")
  })

  it("finds by alias (case-insensitive)", () => {
    expect(findFoodByName(foods, "ごはん")?.name).toBe("白米（精白米）")
  })

  it("returns null when not found", () => {
    expect(findFoodByName(foods, "存在しない")).toBeNull()
  })
})
