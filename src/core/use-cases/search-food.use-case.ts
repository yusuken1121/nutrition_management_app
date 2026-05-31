import { assertNonEmptyFoodQuery } from "../domain/nutrition.validation"
import type { FoodNutrition } from "../domain/food-nutrition.entity"
import type {
  FoodSearchOptions,
  IFoodDatabase,
} from "../ports/food-database.port"

export class SearchFoodUseCase {
  constructor(private readonly foodDatabase: IFoodDatabase) {}

  execute(query: string, options?: FoodSearchOptions): FoodNutrition[] {
    assertNonEmptyFoodQuery(query)
    return this.foodDatabase.searchFood(query, options)
  }
}
