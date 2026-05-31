import {
  calculateDailyCalories,
  getUserNutritionGoals,
  type UserNutritionGoals,
} from "@/core/domain/user-goals.entity"
import {
  DEFAULT_USER_WEIGHT_KG,
  USER_WEIGHT_STORAGE_KEY,
} from "@/constants/user-settings"

export { calculateDailyCalories, getUserNutritionGoals }
export type { UserNutritionGoals }

export function getStoredWeightKg(): number {
  if (typeof window === "undefined") return DEFAULT_USER_WEIGHT_KG
  const stored = localStorage.getItem(USER_WEIGHT_STORAGE_KEY)
  if (!stored) return DEFAULT_USER_WEIGHT_KG
  const parsed = Number(stored)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_USER_WEIGHT_KG
}

export function setStoredWeightKg(weightKg: number): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_WEIGHT_STORAGE_KEY, String(weightKg))
}
