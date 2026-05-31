import type { FoodNutrition } from "@/core/domain/food-nutrition.entity"

const DEFAULT_SEARCH_LIMIT = 10

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

function searchableTexts(food: FoodNutrition): string[] {
  const texts = [food.name]
  if (food.nameEn) texts.push(food.nameEn)
  if (food.aliases) texts.push(...food.aliases)
  return texts.map(normalize)
}

function scoreMatch(food: FoodNutrition, query: string): number {
  const q = normalize(query)
  const texts = searchableTexts(food)

  for (const text of texts) {
    if (text === q) return 100
    if (text.startsWith(q)) return 80
    if (text.includes(q)) return 60
  }

  return 0
}

export function searchFoods(
  foods: FoodNutrition[],
  query: string,
  limit = DEFAULT_SEARCH_LIMIT,
): FoodNutrition[] {
  return foods
    .map((food) => ({ food, score: scoreMatch(food, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ food }) => food)
}

export function findFoodByName(
  foods: FoodNutrition[],
  name: string,
): FoodNutrition | null {
  const normalized = normalize(name)
  return (
    foods.find((food) =>
      searchableTexts(food).some((text) => text === normalized),
    ) ?? null
  )
}
