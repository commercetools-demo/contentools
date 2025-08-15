import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { logger } from '../utils/logger.utils';
import sampleDatasources from '../samples/datasource';

const SHARED_DEPLOYED_URL = 'cms-app-deployed-url';
const SHARED_CMS_CONTAINER = 'cms-shared-container';

export async function createServiceURLStorageLink(
  apiRoot: ByProjectKeyRequestBuilder,
  applicationUrl: string
): Promise<void> {
  await apiRoot
    .customObjects()
    .post({
      body: {
        key: SHARED_DEPLOYED_URL,
        container: SHARED_CMS_CONTAINER,
        value: applicationUrl,
      },
    })
    .execute();
}

export async function createDefaultDatasources(
  apiRoot: ByProjectKeyRequestBuilder
): Promise<void> {
  logger.info('Creating default datasources...');
  try {
    await Promise.all(
      sampleDatasources.map(async (datasource) => {
        return apiRoot
          .customObjects()
          .post({
            body: {
              key: datasource.key,
              container: datasource.container,
              value: datasource.value,
            },
          })
          .execute();
      })
    );
    logger.info('Default datasources created successfully');
  } catch (error) {
    logger.error('Failed to create default datasources:', error);
  }
}
