import {
  scaleNutrients,
  type CalculatedNutrition,
} from "../domain/food-nutrition.entity"
import {
  assertValidGrams,
  FoodNotFoundError,
} from "../domain/nutrition.validation"
import type { IFoodDatabase } from "../ports/food-database.port"

export class CalculateNutritionUseCase {
  constructor(private readonly foodDatabase: IFoodDatabase) {}

  execute(foodName: string, grams: number): CalculatedNutrition {
    assertValidGrams(grams)

    const food = this.foodDatabase.findByName(foodName)
    if (!food) {
      throw new FoodNotFoundError(foodName)
    }

    return {
      foodName: food.name,
      grams,
      nutrients: scaleNutrients(food.per100g, grams),
    }
  }
}
