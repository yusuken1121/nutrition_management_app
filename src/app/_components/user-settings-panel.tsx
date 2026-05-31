"use client"

import { useEffect, useState } from "react"
import { getUserNutritionGoals } from "@/lib/user"
import { useUserWeight } from "@/hooks/use-user-weight"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UserSettingsPanel() {
  const { weightKg, setWeightKg, hydrated } = useUserWeight()
  const [inputValue, setInputValue] = useState(String(weightKg))

  useEffect(() => {
    if (hydrated) setInputValue(String(weightKg))
  }, [hydrated, weightKg])

  const goals = getUserNutritionGoals(weightKg)

  const handleBlur = () => {
    const parsed = Number(inputValue)
    if (Number.isFinite(parsed) && parsed >= 20 && parsed <= 300) {
      setWeightKg(parsed)
    } else {
      setInputValue(String(weightKg))
    }
  }

  if (!hydrated) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>栄養目標</CardTitle>
        <CardDescription>
          体重から1日のカロリー目標を算出します（localStorage に保存）
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="settings-weight">体重 (kg)</Label>
          <Input
            id="settings-weight"
            type="number"
            min={20}
            max={300}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            className="max-w-[140px]"
          />
        </div>
        <div className="rounded-lg border bg-muted/40 p-4 text-sm">
          <p>
            目標カロリー:{" "}
            <span className="font-semibold">{goals.dailyCalories} kcal / 日</span>
          </p>
          <p className="mt-1 text-muted-foreground">
            計算式: 体重 × 28（簡易推定）
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
