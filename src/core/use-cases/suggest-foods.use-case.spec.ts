import { describe, expect, it, vi } from "vitest"
import type { IAIGateway } from "../ports/ai-gateway.port"
import { SuggestFoodsUseCase } from "./suggest-foods.use-case"
import { createEmptyDailyTotals } from "../domain/food-log-entry.entity"
import { calculateDeficiencies } from "../domain/deficiency.entity"

describe("SuggestFoodsUseCase", () => {
  it("parses AI response into suggestions", async () => {
    const aiGateway: IAIGateway = {
      generate: vi.fn().mockResolvedValue(
        JSON.stringify({
          suggestions: [
            {
              name: "ほうれん草",
              nutrients: "鉄・ビタミンC",
              amount: "100g",
            },
          ],
        }),
      ),
      generateStream: vi.fn(),
    }

    const deficiencies = calculateDeficiencies(65, {
      ...createEmptyDailyTotals(),
      iron: 2,
    })

    const useCase = new SuggestFoodsUseCase(aiGateway)
    const result = await useCase.execute({ deficiencies, weightKg: 65 })

    expect(result.suggestions).toHaveLength(1)
    expect(result.suggestions[0]?.name).toBe("ほうれん草")
  })
})
