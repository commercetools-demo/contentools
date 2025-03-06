import { createApiRoot } from '../client/create.client';
import CustomError from '../errors/custom.error';

const CONTAINER = process.env.MAIN_CONTAINER || 'default';

interface CommercetoolsError {
  statusCode: number;
  message: string;
}

/**
 * Create a custom object
 * @param container The container name
 * @param key The custom object key
 * @param value The custom object value
 * @returns The created custom object
 */
export const createCustomObject = async (container: string | undefined, key: string, value: any) => {
  try {
    const apiRoot = createApiRoot();
    const response = await apiRoot
      .customObjects()
      .post({
        body: {
          container: container || CONTAINER,
          key,
          value
        }
      })
      .execute();
    
    return response.body;
  } catch (error) {
    const apiError = error as CommercetoolsError;
    throw new CustomError(
      apiError.statusCode || 500,
      `Failed to create custom object: ${apiError.message}`
    );
  }
};

/**
 * Get a custom object by container and key
 * @param container The container name
 * @param key The custom object key
 * @returns The custom object if found
 */
export const getCustomObject = async (container: string | undefined, key: string) => {
  try {
    const apiRoot = createApiRoot();
    const response = await apiRoot
      .customObjects()
      .withContainerAndKey({ container: container || CONTAINER, key })
      .get()
      .execute();
    
    return response.body;
  } catch (error) {
    const apiError = error as CommercetoolsError;
    if (apiError.statusCode === 404) {
      throw new CustomError(404, `Custom object not found with key: ${key}`);
    }
    throw new CustomError(
      apiError.statusCode || 500,
      `Failed to get custom object: ${apiError.message}`
    );
  }
};

/**
 * Update a custom object
 * @param container The container name
 * @param key The custom object key
 * @param value The new value
 * @returns The updated custom object
 */
export const updateCustomObject = async (container: string | undefined, key: string, value: any) => {
  try {
    const apiRoot = createApiRoot();
    const response = await apiRoot
      .customObjects()
      .post({
        body: {
          container: container || CONTAINER,
          key,
          value
        }
      })
      .execute();
    
    return response.body;
  } catch (error) {
    const apiError = error as CommercetoolsError;
    throw new CustomError(
      apiError.statusCode || 500,
      `Failed to update custom object: ${apiError.message}`
    );
  }
};

/**
 * Delete a custom object
 * @param container The container name
 * @param key The custom object key
 */
export const deleteCustomObject = async (container: string | undefined, key: string) => {
  try {
    const apiRoot = createApiRoot();
    await apiRoot
      .customObjects()
      .withContainerAndKey({ container: container || CONTAINER, key })
      .delete()
      .execute();
  } catch (error) {
    const apiError = error as CommercetoolsError;
    if (apiError.statusCode === 404) {
      throw new CustomError(404, `Custom object not found with key: ${key}`);
    }
    throw new CustomError(
      apiError.statusCode || 500,
      `Failed to delete custom object: ${apiError.message}`
    );
  }
};

/**
 * Get all custom objects in a container
 * @param container The container name
 * @returns Array of custom objects
 */
export const getCustomObjects = async (container?: string) => {
  try {
    const apiRoot = createApiRoot();
    const response = await apiRoot
      .customObjects()
      .get({
        queryArgs: {
          where: `container = "${container || CONTAINER}"`
        }
      })
      .execute();
    
    return response.body.results;
  } catch (error) {
    const apiError = error as CommercetoolsError;
    throw new CustomError(
      apiError.statusCode || 500,
      `Failed to get custom objects: ${apiError.message}`
    );
  }
};
