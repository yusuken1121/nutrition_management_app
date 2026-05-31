"use client"

import { MEAL_TIMES } from "@/core/domain/meal-time.vo"
import { useDailySummary } from "@/lib/api/queries/useFood"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function MacroRow({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit: string
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">
        {value}
        {unit}
      </span>
    </div>
  )
}

export function DailySummary() {
  const { data, isLoading, isError, error } = useDailySummary()

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="w-full border-destructive">
        <CardContent className="pt-6 text-destructive text-sm">
          {error.message || "サマリーの取得に失敗しました"}
        </CardContent>
      </Card>
    )
  }

  const summary = data?.summary
  if (!summary) return null

  const { totals, byMealTime, entries } = summary

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>今日の摂取</CardTitle>
        <CardDescription>{summary.date} · {entries.length} 件</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="mb-3 text-lg font-semibold">{totals.calories} kcal</p>
          <div className="space-y-2">
            <MacroRow label="タンパク質" value={totals.protein} unit="g" />
            <MacroRow label="脂質" value={totals.fat} unit="g" />
            <MacroRow label="炭水化物" value={totals.carbs} unit="g" />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">ビタミン・ミネラル</p>
          <MacroRow label="ビタミンA" value={totals.vitaminA} unit="μg" />
          <MacroRow label="ビタミンC" value={totals.vitaminC} unit="mg" />
          <MacroRow label="カルシウム" value={totals.calcium} unit="mg" />
          <MacroRow label="鉄" value={totals.iron} unit="mg" />
        </div>

        {MEAL_TIMES.map((meal) => {
          const mealEntries = byMealTime[meal]
          if (mealEntries.length === 0) return null

          return (
            <div key={meal}>
              <h3 className="mb-2 font-medium text-sm">{meal}</h3>
              <ul className="space-y-2">
                {mealEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span>
                      {entry.foodName}{" "}
                      <span className="text-muted-foreground">({entry.grams}g)</span>
                    </span>
                    <span className="text-muted-foreground">{entry.calories} kcal</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        {entries.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            まだ記録がありません
          </p>
        )}
      </CardContent>
    </Card>
  )
}
