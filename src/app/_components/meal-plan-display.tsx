"use client"

import { CalendarDays, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useUserWeight } from "@/hooks/use-user-weight"
import { useSuggestMealPlan } from "@/lib/api/queries/useAiNutrition"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function MealBlock({
  title,
  description,
  foods,
}: {
  title: string
  description: string
  foods: string[]
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="font-medium text-sm">{title}</p>
      <p className="mb-2 text-muted-foreground text-sm">{description}</p>
      <ul className="list-inside list-disc text-sm">
        {foods.map((food) => (
          <li key={food}>{food}</li>
        ))}
      </ul>
    </div>
  )
}

export function MealPlanDisplay() {
  const { weightKg, hydrated } = useUserWeight()
  const { mutate, isPending, data, isError, error } = useSuggestMealPlan()

  const handleGenerate = () => {
    mutate(
      { weightKg },
      {
        onError: (err) =>
          toast.error(err.message || "食事プランの取得に失敗しました"),
      },
    )
  }

  if (!hydrated) return null

  const plan = data?.mealPlan

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          AI 1日の食事例
        </CardTitle>
        <CardDescription>朝・昼・夕の献立イメージを提案します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isPending}
          onClick={handleGenerate}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              プランを生成中...
            </>
          ) : (
            "食事プランを作成"
          )}
        </Button>

        {isError && (
          <p className="text-destructive text-sm">
            {error.message || "エラーが発生しました"}
          </p>
        )}

        {plan && (
          <div className="space-y-3">
            <MealBlock
              title={plan.breakfast.mealTime}
              description={plan.breakfast.description}
              foods={plan.breakfast.foods}
            />
            <MealBlock
              title={plan.lunch.mealTime}
              description={plan.lunch.description}
              foods={plan.lunch.foods}
            />
            <MealBlock
              title={plan.dinner.mealTime}
              description={plan.dinner.description}
              foods={plan.dinner.foods}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
