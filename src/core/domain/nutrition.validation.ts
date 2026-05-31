export const NUTRITION_GRAMS_MIN = 1
export const NUTRITION_GRAMS_MAX = 10_000

export class InvalidNutritionInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidNutritionInputError"
  }
}

export class FoodNotFoundError extends Error {
  constructor(foodName: string) {
    super(`Food not found: ${foodName}`)
    this.name = "FoodNotFoundError"
  }
}

export function assertValidGrams(grams: number): void {
  if (!Number.isFinite(grams) || grams < NUTRITION_GRAMS_MIN) {
    throw new InvalidNutritionInputError(
      `Amount must be at least ${NUTRITION_GRAMS_MIN}g`,
    )
  }
  if (grams > NUTRITION_GRAMS_MAX) {
    throw new InvalidNutritionInputError(
      `Amount must be at most ${NUTRITION_GRAMS_MAX}g`,
    )
  }
}

export function assertNonEmptyFoodQuery(query: string): void {
  const trimmed = query.trim()
  if (trimmed.length === 0) {
    throw new InvalidNutritionInputError("Food search query is required")
  }
}
