import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import { useDatasource } from '@commercetools-demo/puck-api';
import { DatasourceField, type DatasourceValue } from '../../fields/DatasourceField';
import { formatPrice, getFirstPrice, getLocalizedText, getProductImage, getProductSlug } from './shared';

export interface RelatedProductsSliderProps {
  title: string;
  subtitle: string;
  products: DatasourceValue;
}

const RelatedProductsRender: React.FC<RelatedProductsSliderProps> = ({ title, subtitle, products }) => {
  const hasPreResolved = products?.resolvedData != null;
  const { data: fetchedData, loading } = useDatasource(
    hasPreResolved ? undefined : products?.type,
    hasPreResolved ? [] : (products?.skus ?? [])
  );
  const items: unknown[] = hasPreResolved
    ? (Array.isArray(products.resolvedData) ? products.resolvedData : [])
    : (Array.isArray(fetchedData) ? fetchedData : []);

  if (!loading && items.length === 0) return null;

  return (
    <div style={{ padding: '2rem 0' }}>
      {(title || subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {title && <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>{title}</h2>}
          {subtitle && <p style={{ fontSize: '1.1rem', color: '#666', margin: 0 }}>{subtitle}</p>}
        </div>
      )}
      {loading && <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>Loading…</div>}
      {items.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '1rem',
          }}
        >
          {items.map((product, i) => {
            const name = getLocalizedText((product as any)?.name);
            const imageUrl = getProductImage(product);
            const priceVal = getFirstPrice(product);
            const slug = getProductSlug(product);
            return (
              <a
                key={(product as any)?.id ?? i}
                href={slug}
                style={{
                  flex: '0 0 280px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  scrollSnapAlign: 'start',
                }}
              >
                <div style={{ width: '100%', height: '200px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {imageUrl
                    ? <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <span style={{ color: '#999', fontSize: '0.85rem' }}>No image</span>
                  }
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>{name}</h3>
                  {priceVal && (
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c5530' }}>
                      {formatPrice(priceVal.centAmount, priceVal.currencyCode, priceVal.fractionDigits)}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const RelatedProductsSlider: ComponentConfig<RelatedProductsSliderProps> = {
  label: 'Related Products',
  fields: {
    title: { type: 'text', label: 'Title' },
    subtitle: { type: 'text', label: 'Subtitle' },
    products: {
      type: 'custom', label: 'Products',
      render: ({ value, onChange }) => <DatasourceField value={value} onChange={onChange} />,
    },
  },
  defaultProps: {
    title: 'Related Products',
    subtitle: '',
    products: { type: 'products-by-sku', skus: [''] },
  },
  render: (props) => <RelatedProductsRender {...props} />,
};
