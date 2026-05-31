import type {
  CalculatedNutrition,
  FoodNutrition,
} from "@/core/domain/food-nutrition.entity"

export interface NutritionSearchResponse {
  results: FoodNutrition[]
}

export interface NutritionCalculateResponse {
  result: CalculatedNutrition
}
