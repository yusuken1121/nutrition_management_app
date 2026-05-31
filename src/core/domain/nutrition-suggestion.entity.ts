export interface FoodSuggestionItem {
  name: string
  nutrients: string
  amount: string
}

export interface FoodSuggestionsResult {
  suggestions: FoodSuggestionItem[]
}

export interface MealPlanMeal {
  mealTime: string
  description: string
  foods: string[]
}

export interface MealPlanResult {
  breakfast: MealPlanMeal
  lunch: MealPlanMeal
  dinner: MealPlanMeal
}
