import {
  CONFIGURATION_CONTAINER,
  CONFIGURATION_THEME_KEY,
} from '../constants';
import CustomError from '../errors/custom.error';
import { CustomObjectController } from './custom-object.controller';
import { AuthenticatedRequest } from '../types/service.types';

/**
 * Build the custom object key for theme scoped by business unit.
 * Data in the configuration container is partitioned by business unit key.
 */
function getThemeKey(businessUnitKey: string): string {
  return `${businessUnitKey}-${CONFIGURATION_THEME_KEY}`;
}

/**
 * Get theme configuration for a business unit.
 * Returns the theme value or null if not found (404 is converted to null).
 */
export const getTheme = async (
  req: AuthenticatedRequest,
  businessUnitKey: string
): Promise<Record<string, unknown> | null> => {
  const controller = new CustomObjectController(req, CONFIGURATION_CONTAINER);
  const key = getThemeKey(businessUnitKey);
  try {
    const object = await controller.getCustomObject(key);
    return (object?.value as Record<string, unknown>) ?? null;
  } catch (error) {
    if (error instanceof CustomError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Create theme configuration for a business unit.
 */
export const createTheme = async (
  req: AuthenticatedRequest,
  businessUnitKey: string,
  value: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const controller = new CustomObjectController(req, CONFIGURATION_CONTAINER);
  const key = getThemeKey(businessUnitKey);
  const object = await controller.createCustomObject(key, value);
  return (object?.value as Record<string, unknown>) ?? value;
};

/**
 * Update theme configuration for a business unit.
 */
export const updateTheme = async (
  req: AuthenticatedRequest,
  businessUnitKey: string,
  value: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const controller = new CustomObjectController(req, CONFIGURATION_CONTAINER);
  const key = getThemeKey(businessUnitKey);
  const object = await controller.updateCustomObject(key, value);
  return (object?.value as Record<string, unknown>) ?? value;
};

/**
 * Delete theme configuration for a business unit.
 */
export const deleteTheme = async (
  req: AuthenticatedRequest,
  businessUnitKey: string
): Promise<void> => {
  const controller = new CustomObjectController(req, CONFIGURATION_CONTAINER);
  const key = getThemeKey(businessUnitKey);
  await controller.deleteCustomObject(key);
};
