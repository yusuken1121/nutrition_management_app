import { NextRequest, NextResponse } from "next/server"
import { GetDeficienciesUseCase } from "@/core/use-cases/get-deficiencies.use-case"
import { SuggestFoodsUseCase } from "@/core/use-cases/suggest-foods.use-case"
import { createFoodLogReader } from "@/infrastructure/notion"
import { createGeminiGateway } from "@/infrastructure/gemini"
import { getTodayDateString } from "@/lib/date-utils"
import { aiNutritionRequestSchema } from "@/lib/validators/ai-nutrition.schema"
import { handleRouteError } from "@/lib/route-error"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = aiNutritionRequestSchema.parse(body)
    const date = validated.date ?? getTodayDateString()

    const deficienciesResult = await new GetDeficienciesUseCase(
      createFoodLogReader(),
    ).execute(date, validated.weightKg)

    const suggestions = await new SuggestFoodsUseCase(
      createGeminiGateway(),
    ).execute({
      deficiencies: deficienciesResult.deficiencies,
      weightKg: validated.weightKg,
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    return handleRouteError(error, "/api/ai/suggest-foods Route Handler")
  }
}
