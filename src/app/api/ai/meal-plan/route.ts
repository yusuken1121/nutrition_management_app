import { NextRequest, NextResponse } from "next/server"
import { GetDeficienciesUseCase } from "@/core/use-cases/get-deficiencies.use-case"
import { SuggestMealPlanUseCase } from "@/core/use-cases/suggest-meal-plan.use-case"
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

    const mealPlan = await new SuggestMealPlanUseCase(
      createGeminiGateway(),
    ).execute({
      deficiencies: deficienciesResult.deficiencies,
      weightKg: validated.weightKg,
    })

    return NextResponse.json({ mealPlan })
  } catch (error) {
    return handleRouteError(error, "/api/ai/meal-plan Route Handler")
  }
}
