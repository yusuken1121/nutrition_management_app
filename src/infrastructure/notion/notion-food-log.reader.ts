import type { Client } from "@notionhq/client"
import type { FoodLogEntryWithId } from "@/core/domain/food-log-entry.entity"
import type { IFoodLogReader } from "@/core/ports/food-log-reader.port"
import { FOOD_LOG_PROPERTY, foodLogDataSourceId } from "./food-log.config"
import { NotionClientFactory } from "./notion-client.factory"
import { NotionWriteError } from "./notion-write.error"
import { parseFoodLogPages } from "./notion-property.parser"

export class NotionFoodLogReader implements IFoodLogReader {
  private readonly client: Client

  constructor(client?: Client) {
    this.client = client ?? NotionClientFactory.create()
  }

  async queryByDate(date: string): Promise<FoodLogEntryWithId[]> {
    if (!foodLogDataSourceId) {
      throw new Error(
        "Notion food log is not configured. Set NOTION_FOOD_LOG_DATABASE_ID or NOTION_FOOD_LOG_DATA_SOURCE_ID.",
      )
    }

    try {
      const response = await this.client.dataSources.query({
        data_source_id: foodLogDataSourceId,
        filter: {
          property: FOOD_LOG_PROPERTY.DATE,
          date: { equals: date },
        },
      })

      return parseFoodLogPages(response.results)
    } catch (error) {
      throw new NotionWriteError("Failed to query Notion food log", error)
    }
  }
}

export function createFoodLogReader(): IFoodLogReader {
  return new NotionFoodLogReader()
}
