import { CONTENT_TYPE_CONTAINER } from '../routes/content-type.route';
import { logger } from '../utils/logger.utils';
import { CustomObjectController } from './custom-object.controller';
import { resolveDatasource } from './datasource-resolution.route';

// Define types for our objects
export interface ContentItem {
  id: string;
  version: number;
  container: string;
  key: string;
  value: {
    key: string;
    type: string;
    businessUnitKey: string;
    properties: Record<string, any>;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ContentType {
  id: string;
  version: number;
  container: string;
  key: string;
  value: {
    metadata: {
      propertySchema: Record<string, PropertySchema>;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export interface PropertySchema {
  type: string;
  datasourceType?: string;
  [key: string]: any;
}

export interface Datasource {
  id: string;
  version: number;
  container: string;
  key: string;
  value: {
    deployedUrl?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export class ContentItemController {
  private contentItemController: CustomObjectController;
  private contentTypeController: CustomObjectController;

  constructor(contentItemController: CustomObjectController) {
    this.contentItemController = contentItemController;
    this.contentTypeController = new CustomObjectController(
      CONTENT_TYPE_CONTAINER
    );
  }

  /**
   * Get a content item by key and resolve any datasource properties
   * @param key The content item key
   * @returns The content item with resolved datasource properties
   */
  async getContentItem(key: string): Promise<ContentItem> {
    // Get the content item
    const contentItem = (await this.contentItemController.getCustomObject(
      key
    )) as ContentItem;

    if (!contentItem?.value?.type) {
      return contentItem;
    }

    // Get the content type associated with this content item
    try {
      const contentType = (await this.contentTypeController.getCustomObject(
        contentItem.value.type
      )) as ContentType;
      // If content type exists, resolve any datasource properties
      if (contentType) {
        return await this.resolveDatasourceProperties(contentItem, contentType);
      }
    } catch (error) {
      logger.error(
        `Failed to get content type for item with key ${key}:`,
        error
      );
      // Continue and return the original content item if content type not found
    }

    // Return the original content item if no datasource resolution happened
    return contentItem;
  }

  /**
   * Helper function to process and resolve datasource properties
   * @param contentItem The content item to process
   * @param contentType The content type containing the property schema
   * @returns The content item with resolved datasource properties
   */
  private async resolveDatasourceProperties(
    contentItem: ContentItem,
    contentType: ContentType
  ): Promise<ContentItem> {
    if (!contentType?.value?.metadata?.propertySchema) {
      return contentItem;
    }

    const clonedContentItem = JSON.parse(JSON.stringify(contentItem));
    const properties = clonedContentItem.value.properties || {};
    const propertySchema = contentType.value.metadata.propertySchema;

    // Find properties with type "datasource"
    const datasourceProperties = Object.entries(propertySchema)
      .filter(([_, schema]) => (schema as PropertySchema).type === 'datasource')
      .map(([key]) => key);

    // No datasource properties to resolve
    if (datasourceProperties.length === 0) {
      return clonedContentItem;
    }

    // Process each datasource property
    for (const propertyKey of datasourceProperties) {
      const propertyValue = properties[propertyKey];
      if (!propertyValue) continue;

      try {
        // Get datasource info by key from schema
        const datasourceKey = (propertySchema[propertyKey] as PropertySchema)
          .datasourceType;
        if (!datasourceKey) continue;

        const resolvedDatasource = await resolveDatasource(
          datasourceKey,
          propertyValue
        );

        // Replace property value with resolved data
        if (resolvedDatasource) {
          clonedContentItem.value.properties[propertyKey] = resolvedDatasource;
        }
      } catch (error) {
        logger.error(
          `Failed to resolve datasource for property ${propertyKey}:`,
          error
        );
      }
    }

    return clonedContentItem;
  }
}
