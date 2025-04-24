import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

const SHARED_DEPLOYED_URL = 'cms-app-deployed-url';
const SHARED_CMS_CONTAINER = 'cms-shared-container';

export async function createCustomObject(
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
