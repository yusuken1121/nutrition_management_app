import { NextRequest, NextResponse } from "next/server"
import { GetDailySummaryUseCase } from "@/core/use-cases/get-daily-summary.use-case"
import { createFoodLogReader } from "@/infrastructure/notion"
import { getTodayDateString } from "@/lib/date-utils"
import { dailySummaryQuerySchema } from "@/lib/validators/food.schema"
import { handleRouteError } from "@/lib/route-error"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const validated = dailySummaryQuerySchema.parse({
      date: searchParams.get("date") ?? undefined,
    })

    const date = validated.date ?? getTodayDateString()
    const useCase = new GetDailySummaryUseCase(createFoodLogReader())
    const summary = await useCase.execute(date)

    return NextResponse.json({ summary })
  } catch (error) {
    return handleRouteError(error, "/api/daily-summary Route Handler")
  }
}
