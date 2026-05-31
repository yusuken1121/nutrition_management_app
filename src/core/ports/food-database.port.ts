import type { FoodNutrition } from "../domain/food-nutrition.entity"

export interface FoodSearchOptions {
  limit?: number
}

export interface IFoodDatabase {
  searchFood(query: string, options?: FoodSearchOptions): FoodNutrition[]
  findByName(name: string): FoodNutrition | null
}
