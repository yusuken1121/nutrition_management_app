import { NextRequest, NextResponse } from "next/server"
import { AddFoodLogUseCase } from "@/core/use-cases/add-food-log.use-case"
import { createFoodDatabase } from "@/infrastructure/nutrition"
import { createFoodLogWriter } from "@/infrastructure/notion"
import { getTodayDateString } from "@/lib/date-utils"
import { addFoodLogBodySchema } from "@/lib/validators/food.schema"
import { handleRouteError } from "@/lib/route-error"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = addFoodLogBodySchema.parse(body)

    const useCase = new AddFoodLogUseCase(
      createFoodDatabase(),
      createFoodLogWriter(),
    )

    const result = await useCase.execute({
      foodName: validated.foodName,
      grams: validated.grams,
      mealTime: validated.mealTime,
      date: validated.date ?? getTodayDateString(),
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return handleRouteError(error, "/api/food/add Route Handler")
  }
}
