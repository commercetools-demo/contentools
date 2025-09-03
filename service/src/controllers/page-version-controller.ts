import { v4 as uuidv4 } from 'uuid';
import { CustomObjectController } from './custom-object.controller';
import { PAGE_VERSION_CONTAINER, MAX_VERSIONS, CONTENT_PAGE_CONTAINER } from '../constants';
import CustomError from '../errors/custom.error';

export interface PageVersion {
  key: string;
  businessUnitKey: string;
  versions: any[];
}

export const getPageVersions = async (
  businessUnitKey: string,
  key: string
): Promise<PageVersion> => {
  const pageVersionController = new CustomObjectController(
    PAGE_VERSION_CONTAINER
  );
  try {
    const versionKey = `${businessUnitKey}_${key}`;

    const pageVersions = await pageVersionController.getCustomObject(
      versionKey
    );
    return pageVersions.value;
  } catch (error) {
    if ((error as any).statusCode === 404) {
      return {
        key,
        businessUnitKey,
        versions: [],
      };
    } else {
      throw new CustomError(500, 'Failed to get versions');
    }
  }
};

export const createContentVersion = async (
  businessUnitKey: string,
  key: string,
  value: any
): Promise<PageVersion> => {
  const versionKey = `${businessUnitKey}_${key}`;
  const existingVersions = await getPageVersions(businessUnitKey, key);

  const newVersion = {
    ...value,
    timestamp: new Date().toISOString(),
    id: uuidv4(),
  };

  existingVersions.versions.unshift(newVersion);

  const pageVersionController = new CustomObjectController(
    PAGE_VERSION_CONTAINER
  );

  if (existingVersions.versions.length > MAX_VERSIONS) {
    existingVersions.versions = existingVersions.versions.slice(
      0,
      MAX_VERSIONS
    );
  }
  const pageVersion = await pageVersionController.updateCustomObject(
    versionKey,
    existingVersions
  );
  return pageVersion.value;
};

export const deleteVersions = async (
  businessUnitKey: string,
  key: string
): Promise<void> => {
  const versionKey = `${businessUnitKey}_${key}`;
  const pageVersionController = new CustomObjectController(
    PAGE_VERSION_CONTAINER
  );
  await pageVersionController.deleteCustomObject(versionKey);
};
