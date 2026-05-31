import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { FoodLogEntryWithId } from "@/core/domain/food-log-entry.entity"
import { isMealTime, type MealTime } from "@/core/domain/meal-time.vo"
import { FOOD_LOG_PROPERTY } from "./food-log.config"

function isFullPage(
  page: PageObjectResponse | { object: string },
): page is PageObjectResponse {
  return page.object === "page" && "properties" in page
}

function getTitle(props: PageObjectResponse["properties"], name: string): string {
  const prop = props[name]
  if (prop?.type !== "title") return ""
  return prop.title.map((t) => t.plain_text).join("")
}

function getNumber(props: PageObjectResponse["properties"], name: string): number {
  const prop = props[name]
  if (prop?.type !== "number" || prop.number === null) return 0
  return prop.number
}

function getSelect(props: PageObjectResponse["properties"], name: string): string {
  const prop = props[name]
  if (prop?.type !== "select" || !prop.select) return ""
  return prop.select.name
}

function getDate(props: PageObjectResponse["properties"], name: string): string {
  const prop = props[name]
  if (prop?.type !== "date" || !prop.date?.start) return ""
  return prop.date.start.slice(0, 10)
}

export function parseFoodLogPage(page: PageObjectResponse): FoodLogEntryWithId {
  const props = page.properties
  const mealTimeRaw = getSelect(props, FOOD_LOG_PROPERTY.MEAL_TIME)
  const mealTime: MealTime = isMealTime(mealTimeRaw) ? mealTimeRaw : "間食"

  return {
    id: page.id,
    foodName: getTitle(props, FOOD_LOG_PROPERTY.FOOD_NAME),
    date: getDate(props, FOOD_LOG_PROPERTY.DATE),
    mealTime,
    grams: getNumber(props, FOOD_LOG_PROPERTY.GRAMS),
    calories: getNumber(props, FOOD_LOG_PROPERTY.CALORIES),
    protein: getNumber(props, FOOD_LOG_PROPERTY.PROTEIN),
    fat: getNumber(props, FOOD_LOG_PROPERTY.FAT),
    carbs: getNumber(props, FOOD_LOG_PROPERTY.CARBS),
    vitaminA: getNumber(props, FOOD_LOG_PROPERTY.VITAMIN_A),
    vitaminB: getNumber(props, FOOD_LOG_PROPERTY.VITAMIN_B),
    vitaminC: getNumber(props, FOOD_LOG_PROPERTY.VITAMIN_C),
    vitaminD: getNumber(props, FOOD_LOG_PROPERTY.VITAMIN_D),
    vitaminE: getNumber(props, FOOD_LOG_PROPERTY.VITAMIN_E),
    calcium: getNumber(props, FOOD_LOG_PROPERTY.CALCIUM),
    iron: getNumber(props, FOOD_LOG_PROPERTY.IRON),
    magnesium: getNumber(props, FOOD_LOG_PROPERTY.MAGNESIUM),
  }
}

export function parseFoodLogPages(
  pages: Array<PageObjectResponse | { object: string }>,
): FoodLogEntryWithId[] {
  return pages.filter(isFullPage).map(parseFoodLogPage)
}
