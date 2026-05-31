import type { FoodLogEntry } from "../../core/domain/food-log-entry.entity"
import type { INotionRecordWriter } from "../../core/ports/notion-record-writer.port"
import { ConfigurableNotionGateway } from "./configurable-notion.gateway"
import { foodLogNotionConfig } from "./food-log.config"
import type { NotionDatabaseConfig } from "./notion-field-mapping.types"

export { ConfigurableNotionGateway } from "./configurable-notion.gateway"
export { NotionClientFactory } from "./notion-client.factory"
export { NotionPropertyBuilder } from "./notion-property.builder"
export { NotionWriteError } from "./notion-write.error"
export type {
  NotionDatabaseConfig,
  NotionFieldMapping,
  NotionFieldType,
} from "./notion-field-mapping.types"

/**
 * Factory for Dependency Injection.
 * Composition Root (Route Handler) should call this — not Use Cases.
 */
export function createNotionRecordWriter<TRecord>(
  config: NotionDatabaseConfig<TRecord>,
  envHint = "NOTION_CONTACT_DATABASE_ID",
): INotionRecordWriter<TRecord> {
  if (!config.databaseId) {
    throw new Error(
      `Notion database ID is not configured. Set ${envHint}.`,
    )
  }

  return new ConfigurableNotionGateway(config)
}

export { foodLogNotionConfig, FOOD_LOG_PROPERTY } from "./food-log.config"
export {
  createFoodLogReader,
  NotionFoodLogReader,
} from "./notion-food-log.reader"

export function createFoodLogWriter(): INotionRecordWriter<FoodLogEntry> {
  return createNotionRecordWriter(
    foodLogNotionConfig,
    "NOTION_FOOD_LOG_DATABASE_ID",
  )
}
