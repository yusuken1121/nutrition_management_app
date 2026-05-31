import { NextResponse } from "next/server"
import { z } from "zod"
import { InvalidContactSubmissionError } from "@/core/domain/contact-submission.entity"
import { InvalidMessageHistoryError } from "@/core/domain/message.validation"
import {
  FoodNotFoundError,
  InvalidNutritionInputError,
} from "@/core/domain/nutrition.validation"

const DOMAIN_ERRORS = [
  InvalidContactSubmissionError,
  InvalidMessageHistoryError,
  InvalidNutritionInputError,
  FoodNotFoundError,
]

export function handleRouteError(
  error: unknown,
  context: string,
): NextResponse {
  console.error(`Error in ${context}:`, error)

  if (error instanceof z.ZodError) {
    const errorMessage = error.issues.map((e) => e.message).join(", ")
    return NextResponse.json(
      { error: `Validation error: ${errorMessage}` },
      { status: 400 },
    )
  }

  if (DOMAIN_ERRORS.some((ErrorClass) => error instanceof ErrorClass)) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    )
  }

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Internal Server Error",
    },
    { status: 500 },
  )
}
