import { NextRequest, NextResponse } from "next/server"
import { CalculateNutritionUseCase } from "@/core/use-cases/calculate-nutrition.use-case"
import { createFoodDatabase } from "@/infrastructure/nutrition"
import { calculateNutritionBodySchema } from "@/lib/validators/nutrition.schema"
import { handleRouteError } from "@/lib/route-error"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = calculateNutritionBodySchema.parse(body)

    const useCase = new CalculateNutritionUseCase(createFoodDatabase())
    const result = useCase.execute(validated.foodName, validated.grams)

    return NextResponse.json({ result })
  } catch (error) {
    return handleRouteError(error, "/api/nutrition/calculate Route Handler")
  }
}
