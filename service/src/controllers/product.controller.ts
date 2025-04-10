import { searchProducts } from '../services/products';
import { logger } from '../utils/logger.utils';

export const getProductBySkuController = async (sku: string) => {
  try {
    logger.info('Searching product by SKU:', sku);

    if (!sku) {
      throw new Error('Product SKU is required');
    }

    const product = await searchProducts({
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
    throw error;
  }
};
