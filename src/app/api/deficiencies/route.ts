import { NextRequest, NextResponse } from "next/server"
import { GetDeficienciesUseCase } from "@/core/use-cases/get-deficiencies.use-case"
import { createFoodLogReader } from "@/infrastructure/notion"
import { getTodayDateString } from "@/lib/date-utils"
import { deficienciesQuerySchema } from "@/lib/validators/food.schema"
import { handleRouteError } from "@/lib/route-error"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const validated = deficienciesQuerySchema.parse({
      date: searchParams.get("date") ?? undefined,
      weightKg: searchParams.get("weightKg") ?? "65",
    })

    const date = validated.date ?? getTodayDateString()
    const useCase = new GetDeficienciesUseCase(createFoodLogReader())
    const data = await useCase.execute(date, validated.weightKg)

    return NextResponse.json({ data })
  } catch (error) {
    return handleRouteError(error, "/api/deficiencies Route Handler")
  }
}
