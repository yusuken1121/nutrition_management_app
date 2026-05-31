import { describe, expect, it, vi } from "vitest"
import type { FoodNutrition } from "../domain/food-nutrition.entity"
import type { IFoodDatabase } from "../ports/food-database.port"
import type { INotionRecordWriter } from "../ports/notion-record-writer.port"
import { AddFoodLogUseCase } from "./add-food-log.use-case"

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

describe("AddFoodLogUseCase", () => {
  it("calculates nutrition and writes to Notion", async () => {
    const db: IFoodDatabase = {
      searchFood: () => [sampleFood],
      findByName: () => sampleFood,
    }
    const writer: INotionRecordWriter<import("../domain/food-log-entry.entity").FoodLogEntry> =
      {
        create: vi.fn().mockResolvedValue({ id: "p1", url: "https://notion.so/p1" }),
      }

    const useCase = new AddFoodLogUseCase(db, writer)
    const result = await useCase.execute({
      foodName: "卵（全卵）",
      grams: 100,
      mealTime: "朝食",
      date: "2026-05-31",
    })

    expect(result.entry.calories).toBe(151)
    expect(result.entry.mealTime).toBe("朝食")
    expect(writer.create).toHaveBeenCalledWith(
      expect.objectContaining({ foodName: "卵（全卵）", date: "2026-05-31" }),
    )
  })
})
