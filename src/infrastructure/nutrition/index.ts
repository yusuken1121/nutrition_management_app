import type { IFoodDatabase } from "@/core/ports/food-database.port"
import { JsonFoodDatabaseRepository } from "./json-food-database.repository"

export function createFoodDatabase(): IFoodDatabase {
  return new JsonFoodDatabaseRepository()
}

export { JsonFoodDatabaseRepository, createJsonFoodDatabase } from "./json-food-database.repository"
export { searchFoods, findFoodByName } from "./food-search.util"
