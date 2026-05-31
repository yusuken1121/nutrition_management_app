"use client"

import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { useUserWeight } from "@/hooks/use-user-weight"
import { useSuggestFoods } from "@/lib/api/queries/useAiNutrition"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function FoodSuggestions() {
  const { weightKg, hydrated } = useUserWeight()
  const { mutate, isPending, data, isError, error } = useSuggestFoods()

  const handleSuggest = () => {
    mutate(
      { weightKg },
      {
        onError: (err) =>
          toast.error(err.message || "食材提案の取得に失敗しました"),
      },
    )
  }

  if (!hydrated) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI 食材提案
        </CardTitle>
        <CardDescription>
          不足栄養素を補う食材を AI が提案します（Gemini）
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isPending}
          onClick={handleSuggest}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              提案を生成中...
            </>
          ) : (
            "食材を提案してもらう"
          )}
        </Button>

        {isError && (
          <p className="text-destructive text-sm">
            {error.message || "エラーが発生しました"}
          </p>
        )}

        {data?.suggestions && data.suggestions.length > 0 && (
          <ul className="space-y-3">
            {data.suggestions.map((item) => (
              <li
                key={item.name}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">{item.nutrients}</p>
                <p className="text-muted-foreground text-xs">{item.amount}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
