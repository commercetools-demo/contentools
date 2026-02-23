import { AuthenticatedRequest } from '../types/service.types';
import { logger } from '../utils/logger.utils';
import {
  getProductBySkuController,
  getProductsBySkuController,
} from './product.controller';

export const resolveDatasource = async (
  req: AuthenticatedRequest,
  datasourceKey: string,
  params: Record<string, any>
) => {
  try {
    switch (datasourceKey) {
      case 'product-by-sku':
        return getProductBySkuController(req, params.sku);
      case 'products-by-sku':
        return getProductsBySkuController(req, params.skus);
    }
  } catch (error) {
    logger.error('Failed to resolve datasource:', error);
    return null;
  }
};
