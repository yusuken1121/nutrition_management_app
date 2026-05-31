/** Nutrients per 100g — aligns with Notion schema & requirements.md */
export interface NutrientsPer100g {
  calories: number
  protein: number
  fat: number
  carbs: number
  vitaminA?: number
  vitaminB?: number
  vitaminC?: number
  vitaminD?: number
  vitaminE?: number
  calcium?: number
  iron?: number
  magnesium?: number
}

export interface FoodNutrition {
  name: string
  nameEn?: string
  aliases?: string[]
  per100g: NutrientsPer100g
}

/** Scaled nutrients for a given amount in grams */
export interface CalculatedNutrition {
  foodName: string
  grams: number
  nutrients: NutrientsPer100g
}

export function scaleNutrients(
  per100g: NutrientsPer100g,
  grams: number,
): NutrientsPer100g {
  const factor = grams / 100
  const scale = (value: number | undefined): number | undefined =>
    value === undefined ? undefined : Math.round(value * factor * 100) / 100

  return {
    calories: Math.round(per100g.calories * factor),
    protein: scale(per100g.protein) ?? 0,
    fat: scale(per100g.fat) ?? 0,
    carbs: scale(per100g.carbs) ?? 0,
    vitaminA: scale(per100g.vitaminA),
    vitaminB: scale(per100g.vitaminB),
    vitaminC: scale(per100g.vitaminC),
    vitaminD: scale(per100g.vitaminD),
    vitaminE: scale(per100g.vitaminE),
    calcium: scale(per100g.calcium),
    iron: scale(per100g.iron),
    magnesium: scale(per100g.magnesium),
  }
}
