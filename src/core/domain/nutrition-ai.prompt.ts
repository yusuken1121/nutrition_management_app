import type { NutrientDeficiency } from "./deficiency.entity"

const NUTRITIONIST_SYSTEM_PROMPT = `あなたはプロの栄養士です。
回答は必ず有効なJSONのみを返してください。マークダウンや説明文は含めないでください。`

export function buildFoodSuggestionsUserPrompt(
  deficiencies: NutrientDeficiency[],
  weightKg: number,
): string {
  const lacking = deficiencies
    .filter((d) => d.severity !== "ok")
    .map(
      (d) =>
        `${d.nutrient} (目標の${d.achievementPercentage}%まで / 現在 ${d.current}${d.unit})`,
    )

  const deficiencyText =
    lacking.length > 0 ? lacking.join(", ") : "バランス良く維持したい"

  return `以下の不足栄養素を補うために最適な食材を3〜5つ提案してください。
- 不足栄養素: ${deficiencyText}
- ユーザー体重: ${weightKg}kg
入手しやすく、調理が簡単な食材を優先してください。

次のJSON形式で返してください:
{
  "suggestions": [
    { "name": "食材名", "nutrients": "補える栄養素", "amount": "目安量" }
  ]
}`
}

export function buildMealPlanUserPrompt(
  deficiencies: NutrientDeficiency[],
  weightKg: number,
  dailyCalories: number,
): string {
  const lacking = deficiencies
    .filter((d) => d.severity !== "ok")
    .map((d) => d.nutrient)
    .join(", ")

  return `ユーザー向けに1日の食事例（朝食・昼食・夕食）を提案してください。
- 体重: ${weightKg}kg
- 目標カロリー: 約${dailyCalories}kcal/日
- 特に意識する栄養素: ${lacking || "バランスの取れた食事"}

次のJSON形式で返してください:
{
  "breakfast": { "mealTime": "朝食", "description": "概要", "foods": ["食材1", "食材2"] },
  "lunch": { "mealTime": "昼食", "description": "概要", "foods": ["食材1"] },
  "dinner": { "mealTime": "夕食", "description": "概要", "foods": ["食材1"] }
}`
}

export { NUTRITIONIST_SYSTEM_PROMPT }
