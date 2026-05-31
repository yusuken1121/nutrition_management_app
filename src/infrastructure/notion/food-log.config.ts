import type { FoodLogEntry } from "@/core/domain/food-log-entry.entity"
import type { NotionDatabaseConfig } from "./notion-field-mapping.types"

/** Property names must match your Notion Food Log database columns */
export const FOOD_LOG_PROPERTY = {
  FOOD_NAME: "食材名",
  DATE: "日付",
  MEAL_TIME: "時間帯",
  GRAMS: "量",
  CALORIES: "カロリー",
  PROTEIN: "タンパク質",
  FAT: "脂質",
  CARBS: "炭水化物",
  VITAMIN_A: "ビタミンA",
  VITAMIN_B: "ビタミンB群",
  VITAMIN_C: "ビタミンC",
  VITAMIN_D: "ビタミンD",
  VITAMIN_E: "ビタミンE",
  CALCIUM: "カルシウム",
  IRON: "鉄",
  MAGNESIUM: "マグネシウム",
} as const

/** For Notion API v5 `dataSources.query` — often same as database ID */
export const foodLogDataSourceId =
  process.env.NOTION_FOOD_LOG_DATA_SOURCE_ID ??
  process.env.NOTION_FOOD_LOG_DATABASE_ID ??
  ""

export const foodLogNotionConfig: NotionDatabaseConfig<FoodLogEntry> = {
  databaseId: process.env.NOTION_FOOD_LOG_DATABASE_ID ?? "",
  fields: [
    { recordKey: "foodName", propertyName: FOOD_LOG_PROPERTY.FOOD_NAME, type: "title" },
    { recordKey: "date", propertyName: FOOD_LOG_PROPERTY.DATE, type: "date" },
    { recordKey: "mealTime", propertyName: FOOD_LOG_PROPERTY.MEAL_TIME, type: "select" },
    { recordKey: "grams", propertyName: FOOD_LOG_PROPERTY.GRAMS, type: "number" },
    { recordKey: "calories", propertyName: FOOD_LOG_PROPERTY.CALORIES, type: "number" },
    { recordKey: "protein", propertyName: FOOD_LOG_PROPERTY.PROTEIN, type: "number" },
    { recordKey: "fat", propertyName: FOOD_LOG_PROPERTY.FAT, type: "number" },
    { recordKey: "carbs", propertyName: FOOD_LOG_PROPERTY.CARBS, type: "number" },
    { recordKey: "vitaminA", propertyName: FOOD_LOG_PROPERTY.VITAMIN_A, type: "number" },
    { recordKey: "vitaminB", propertyName: FOOD_LOG_PROPERTY.VITAMIN_B, type: "number" },
    { recordKey: "vitaminC", propertyName: FOOD_LOG_PROPERTY.VITAMIN_C, type: "number" },
    { recordKey: "vitaminD", propertyName: FOOD_LOG_PROPERTY.VITAMIN_D, type: "number" },
    { recordKey: "vitaminE", propertyName: FOOD_LOG_PROPERTY.VITAMIN_E, type: "number" },
    { recordKey: "calcium", propertyName: FOOD_LOG_PROPERTY.CALCIUM, type: "number" },
    { recordKey: "iron", propertyName: FOOD_LOG_PROPERTY.IRON, type: "number" },
    { recordKey: "magnesium", propertyName: FOOD_LOG_PROPERTY.MAGNESIUM, type: "number" },
  ],
}
