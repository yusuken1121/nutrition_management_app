import { NextRequest, NextResponse } from "next/server"
import { SearchFoodUseCase } from "@/core/use-cases/search-food.use-case"
import { createFoodDatabase } from "@/infrastructure/nutrition"
import { nutritionSearchQuerySchema } from "@/lib/validators/nutrition.schema"
import { handleRouteError } from "@/lib/route-error"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const validated = nutritionSearchQuerySchema.parse({
      q: searchParams.get("q") ?? "",
      limit: searchParams.get("limit") ?? undefined,
    })

    const useCase = new SearchFoodUseCase(createFoodDatabase())
    const results = useCase.execute(validated.q, { limit: validated.limit })

    return NextResponse.json({ results })
  } catch (error) {
    return handleRouteError(error, "/api/nutrition/search Route Handler")
  }
}
