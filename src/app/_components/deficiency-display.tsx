"use client"

import type { NutrientDeficiency } from "@/core/domain/deficiency.entity"
import { useUserWeight } from "@/hooks/use-user-weight"
import { useDeficiencies } from "@/lib/api/queries/useFood"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

function severityColor(severity: NutrientDeficiency["severity"]): string {
  switch (severity) {
    case "ok":
      return "text-green-600 dark:text-green-400"
    case "low":
      return "text-yellow-600 dark:text-yellow-400"
    case "critical":
      return "text-red-600 dark:text-red-400"
  }
}

function progressClass(severity: NutrientDeficiency["severity"]): string {
  switch (severity) {
    case "ok":
      return "[&>div]:bg-green-500"
    case "low":
      return "[&>div]:bg-yellow-500"
    case "critical":
      return "[&>div]:bg-red-500"
  }
}

function NutrientRow({ item }: { item: NutrientDeficiency }) {
  const capped = Math.min(item.achievementPercentage, 100)

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className={cn("font-medium", severityColor(item.severity))}>
          {item.nutrient}
        </span>
        <span className="text-muted-foreground">
          {item.current}/{item.recommended} {item.unit} ({item.achievementPercentage}%)
        </span>
      </div>
      <Progress
        value={capped}
        className={cn("h-2", progressClass(item.severity))}
      />
    </div>
  )
}

export function DeficiencyDisplay() {
  const { weightKg, setWeightKg, hydrated } = useUserWeight()
  const { data, isLoading, isError, error } = useDeficiencies(weightKg)

  if (!hydrated) return null

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="w-full border-destructive">
        <CardContent className="pt-6 text-destructive text-sm">
          {error.message || "不足栄養素の取得に失敗しました"}
        </CardContent>
      </Card>
    )
  }

  const deficiencies = data?.data.deficiencies ?? []
  const deficient = deficiencies.filter((d) => d.severity !== "ok")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>栄養バランス</CardTitle>
        <CardDescription>推奨摂取量（RDA）との比較</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="weight">体重 (kg)</Label>
          <Input
            id="weight"
            type="number"
            min={20}
            max={300}
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="max-w-[120px]"
          />
        </div>

        <div className="space-y-4">
          {deficiencies.map((item) => (
            <NutrientRow key={item.nutrient} item={item} />
          ))}
        </div>

        {deficient.length > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950/40">
            <p className="mb-2 font-medium text-sm">不足気味の栄養素</p>
            <ul className="space-y-1 text-sm">
              {deficient.map((item) => (
                <li key={item.nutrient} className={severityColor(item.severity)}>
                  {item.nutrient} — 目標の {item.achievementPercentage}% まで
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
