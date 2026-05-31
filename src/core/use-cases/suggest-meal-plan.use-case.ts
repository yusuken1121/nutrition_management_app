import { createMessage } from "../domain/message.entity"
import { calculateDailyCalories } from "../domain/user-goals.entity"
import {
  NUTRITIONIST_SYSTEM_PROMPT,
  buildMealPlanUserPrompt,
} from "../domain/nutrition-ai.prompt"
import { parseMealPlanResponse } from "../domain/nutrition-ai.parser"
import type { MealPlanResult } from "../domain/nutrition-suggestion.entity"
import type { NutrientDeficiency } from "../domain/deficiency.entity"
import type { IAIGateway } from "../ports/ai-gateway.port"

export interface SuggestMealPlanInput {
  deficiencies: NutrientDeficiency[]
  weightKg: number
}

export class SuggestMealPlanUseCase {
  constructor(private readonly aiGateway: IAIGateway) {}

  async execute(input: SuggestMealPlanInput): Promise<MealPlanResult> {
    const dailyCalories = calculateDailyCalories(input.weightKg)
    const userPrompt = buildMealPlanUserPrompt(
      input.deficiencies,
      input.weightKg,
      dailyCalories,
    )

    const raw = await this.aiGateway.generate(
      [createMessage("user", userPrompt)],
      {
        systemPrompt: NUTRITIONIST_SYSTEM_PROMPT,
        temperature: 0.5,
        maxTokens: 1536,
        model: "gemini-2.0-flash-exp",
      },
    )

    if (process.env.NODE_ENV !== "test") {
      console.info("[AI] meal-plan completed", {
        weightKg: input.weightKg,
        dailyCalories,
        responseLength: raw.length,
      })
    }

    return parseMealPlanResponse(raw)
  }
}
