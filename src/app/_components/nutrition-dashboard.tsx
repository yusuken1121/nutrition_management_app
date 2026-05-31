import { DailySummary } from "@/app/_components/daily-summary"
import { DeficiencyDisplay } from "@/app/_components/deficiency-display"
import { FoodEntryForm } from "@/app/_components/food-entry-form"
import { FoodSuggestions } from "@/app/_components/food-suggestions"
import { MealPlanDisplay } from "@/app/_components/meal-plan-display"

export function NutritionDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">栄養管理</h1>
        <p className="text-muted-foreground text-sm">
          食事記録・摂取サマリー・栄養バランス・AI 提案をまとめて確認できます
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <FoodEntryForm />
          <FoodSuggestions />
          <MealPlanDisplay />
        </div>
        <div className="flex flex-col gap-6">
          <DailySummary />
          <DeficiencyDisplay />
        </div>
      </div>
    </div>
  )
}
