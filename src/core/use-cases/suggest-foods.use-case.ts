import { createMessage } from "../domain/message.entity"
import {
  NUTRITIONIST_SYSTEM_PROMPT,
  buildFoodSuggestionsUserPrompt,
} from "../domain/nutrition-ai.prompt"
import { parseFoodSuggestionsResponse } from "../domain/nutrition-ai.parser"
import type { FoodSuggestionsResult } from "../domain/nutrition-suggestion.entity"
import type { NutrientDeficiency } from "../domain/deficiency.entity"
import type { IAIGateway } from "../ports/ai-gateway.port"

export interface SuggestFoodsInput {
  deficiencies: NutrientDeficiency[]
  weightKg: number
}

export class SuggestFoodsUseCase {
  constructor(private readonly aiGateway: IAIGateway) {}

  async execute(input: SuggestFoodsInput): Promise<FoodSuggestionsResult> {
    const userPrompt = buildFoodSuggestionsUserPrompt(
      input.deficiencies,
      input.weightKg,
    )

    const raw = await this.aiGateway.generate(
      [createMessage("user", userPrompt)],
      {
        systemPrompt: NUTRITIONIST_SYSTEM_PROMPT,
        temperature: 0.4,
        maxTokens: 1024,
        model: "gemini-2.0-flash-exp",
      },
    )

    if (process.env.NODE_ENV !== "test") {
      console.info("[AI] suggest-foods completed", {
        weightKg: input.weightKg,
        deficientCount: input.deficiencies.filter((d) => d.severity !== "ok")
          .length,
        responseLength: raw.length,
      })
    }

    return parseFoodSuggestionsResponse(raw)
  }
}
