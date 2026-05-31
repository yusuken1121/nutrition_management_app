import { describe, expect, it } from "vitest"
import { parseFoodSuggestionsResponse, parseMealPlanResponse } from "./nutrition-ai.parser"

describe("parseFoodSuggestionsResponse", () => {
  it("parses raw JSON", () => {
    const raw = JSON.stringify({
      suggestions: [
        { name: "ブロッコリー", nutrients: "ビタミンC", amount: "100g" },
      ],
    })
    const result = parseFoodSuggestionsResponse(raw)
    expect(result.suggestions[0]?.name).toBe("ブロッコリー")
  })

  it("parses fenced JSON", () => {
    const raw = '```json\n{"suggestions":[{"name":"卵","nutrients":"鉄","amount":"1個"}]}\n```'
    const result = parseFoodSuggestionsResponse(raw)
    expect(result.suggestions[0]?.name).toBe("卵")
  })
})

describe("parseMealPlanResponse", () => {
  it("parses meal plan", () => {
    const raw = JSON.stringify({
      breakfast: {
        mealTime: "朝食",
        description: "軽め",
        foods: ["オートミール"],
      },
      lunch: {
        mealTime: "昼食",
        description: "主食",
        foods: ["ごはん", "魚"],
      },
      dinner: {
        mealTime: "夕食",
        description: "野菜多め",
        foods: ["サラダ"],
      },
    })
    const result = parseMealPlanResponse(raw)
    expect(result.lunch.foods).toContain("ごはん")
  })
})
