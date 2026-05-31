import { readFileSync } from "fs"
import path from "path"
import type { FoodNutrition } from "@/core/domain/food-nutrition.entity"
import type {
  FoodSearchOptions,
  IFoodDatabase,
} from "@/core/ports/food-database.port"
import { findFoodByName, searchFoods } from "./food-search.util"

function loadFoodsFromDisk(): FoodNutrition[] {
  const filePath = path.join(process.cwd(), "data", "foods.json")
  const raw = readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as FoodNutrition[]
}

let cachedFoods: FoodNutrition[] | null = null

function getFoods(): FoodNutrition[] {
  if (!cachedFoods) {
    cachedFoods = loadFoodsFromDisk()
  }
  return cachedFoods
}

export class JsonFoodDatabaseRepository implements IFoodDatabase {
  constructor(private readonly foods: FoodNutrition[] = getFoods()) {}

  searchFood(query: string, options?: FoodSearchOptions): FoodNutrition[] {
    return searchFoods(this.foods, query, options?.limit)
  }

  findByName(name: string): FoodNutrition | null {
    return findFoodByName(this.foods, name)
  }
}

/** Test helper — bypasses filesystem cache */
export function createJsonFoodDatabase(
  foods: FoodNutrition[],
): JsonFoodDatabaseRepository {
  return new JsonFoodDatabaseRepository(foods)
}
