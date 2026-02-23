import { searchProducts } from '../services/products';
import { logger } from '../utils/logger.utils';
import CustomError from '../errors/custom.error';
import { AuthenticatedRequest } from '../types/service.types';

export const getProductBySkuController = async (req: AuthenticatedRequest, sku: string) => {
  try {
    logger.info('Searching product by SKU:', sku);

    if (!sku) {
      throw new CustomError(400, 'Product SKU is required');
    }

    const product = await searchProducts(req, {
      query: {
        exact: {
          field: 'variants.sku',
          value: sku,
        },
      },
      productProjectionParameters: {},
    });
    return product.results?.[0]?.productProjection;
  } catch (error) {
    logger.error('Controller error fetching product by SKU:', error);
    throw new CustomError(500, 'Failed to fetch product by SKU');
  }
};

export const getProductsBySkuController = async (req: AuthenticatedRequest, skus: string) => {
  try {
    logger.info('Searching products by SKUs:', skus);

    const skusArray = skus.split(',').map((sku) => sku.trim());

    if (!skusArray || skusArray.length === 0) {
      throw new CustomError(400, 'SKUs are required');
    }

    const products = await Promise.all(
      skusArray.map((sku) => getProductBySkuController(req, sku))
    );
    return products;
  } catch (error) {
    logger.error('Controller error fetching products by SKUs:', error);
    throw new CustomError(500, 'Failed to fetch products by SKUs');
  }
};
