import type { DailyNutrientTotals } from "./food-log-entry.entity"

export type DeficiencySeverity = "ok" | "low" | "critical"

export interface NutrientDeficiency {
  nutrient: string
  unit: string
  current: number
  recommended: number
  /** Percentage of RDA achieved (0–100+) */
  achievementPercentage: number
  severity: DeficiencySeverity
}

export interface DailyRda {
  calories: number
  protein: number
  fat: number
  carbs: number
  vitaminA: number
  vitaminB: number
  vitaminC: number
  vitaminD: number
  vitaminE: number
  calcium: number
  iron: number
  magnesium: number
}

const NUTRIENT_META: Array<{
  key: keyof DailyNutrientTotals
  label: string
  unit: string
}> = [
  { key: "calories", label: "カロリー", unit: "kcal" },
  { key: "protein", label: "タンパク質", unit: "g" },
  { key: "fat", label: "脂質", unit: "g" },
  { key: "carbs", label: "炭水化物", unit: "g" },
  { key: "vitaminA", label: "ビタミンA", unit: "μg" },
  { key: "vitaminB", label: "ビタミンB群", unit: "mg" },
  { key: "vitaminC", label: "ビタミンC", unit: "mg" },
  { key: "vitaminD", label: "ビタミンD", unit: "μg" },
  { key: "vitaminE", label: "ビタミンE", unit: "mg" },
  { key: "calcium", label: "カルシウム", unit: "mg" },
  { key: "iron", label: "鉄", unit: "mg" },
  { key: "magnesium", label: "マグネシウム", unit: "mg" },
]

/** Simplified RDA estimates — weight scales macros/calories; micronutrients use adult defaults */
export function getDailyRda(weightKg: number): DailyRda {
  return {
    calories: Math.round(weightKg * 28),
    protein: Math.round(weightKg * 1.2 * 10) / 10,
    fat: Math.round(weightKg * 0.9 * 10) / 10,
    carbs: Math.round(weightKg * 4 * 10) / 10,
    vitaminA: 850,
    vitaminB: 1.4,
    vitaminC: 100,
    vitaminD: 8.5,
    vitaminE: 6,
    calcium: 800,
    iron: 7.5,
    magnesium: 340,
  }
}

function toSeverity(achievementPercentage: number): DeficiencySeverity {
  if (achievementPercentage >= 100) return "ok"
  if (achievementPercentage >= 70) return "low"
  return "critical"
}

export function calculateDeficiencies(
  weightKg: number,
  dailyIntake: DailyNutrientTotals,
): NutrientDeficiency[] {
  const rda = getDailyRda(weightKg)

  return NUTRIENT_META.map(({ key, label, unit }) => {
    const current = dailyIntake[key]
    const recommended = rda[key]
    const achievementPercentage =
      recommended > 0
        ? Math.round((current / recommended) * 100)
        : current > 0
          ? 100
          : 0

    return {
      nutrient: label,
      unit,
      current,
      recommended,
      achievementPercentage,
      severity: toSeverity(achievementPercentage),
    }
  }).sort((a, b) => a.achievementPercentage - b.achievementPercentage)
}
