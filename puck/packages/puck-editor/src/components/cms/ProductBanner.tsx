import React from 'react';
import { FormattedMessage, type IntlShape } from 'react-intl';
import { type ComponentConfig } from '@measured/puck';
import { useDatasource } from '@commercetools-demo/puck-api';
import { DatasourceField, type DatasourceValue } from '../../fields/DatasourceField';
import { richTextField } from '../../fields/RichTextField';
import { ColorPickerField } from '../../fields/ColorPickerField';
import {
  formatPrice,
  getFirstPrice,
  getLocalizedText,
  productLinkDefaults,
  createProductLinkFields,
  resolveProductLink,
  type ProductLinkProps,
} from './shared';

export interface ProductBannerProps extends ProductLinkProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  product: DatasourceValue;
  productOnLeft: boolean;
  background: string;
}

const ProductBannerRender: React.FC<ProductBannerProps> = ({
  title, description, ctaText, ctaLink, product, productOnLeft, background, linkWith, baseUrl,
}) => {
  const hasPreResolved = product?.resolvedData != null;
  const { data: fetchedData, loading } = useDatasource(
    hasPreResolved ? undefined : product?.type,
    hasPreResolved ? [] : (product?.skus ?? [])
  );
  const raw = hasPreResolved ? product.resolvedData : fetchedData;
  const p = raw as any;

  const name = getLocalizedText(p?.name);
  const description2 = getLocalizedText(p?.description);
  const imageUrl = p?.masterVariant?.images?.[0]?.url;
  const sku = p?.masterVariant?.sku;
  const priceVal = getFirstPrice(p);
  const productHref = p ? resolveProductLink(p, linkWith, baseUrl) : undefined;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '400px',
        backgroundColor: background || '#f5f5f5',
        padding: '2rem',
        borderRadius: '2px',
        margin: '1rem 0',
        gap: '2rem',
        flexDirection: productOnLeft ? 'row-reverse' : 'row',
        flexWrap: 'wrap',
      }}
    >
      {/* Content side */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        {title && <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>{title}</h2>}
        {description && (
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            style={{ marginBottom: '2rem', color: '#555', lineHeight: 1.6 }}
          />
        )}
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#2c5530',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '2px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {ctaText}
          </a>
        )}
      </div>

      {/* Product side */}
      <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {loading && <div style={{ color: '#999', padding: '2rem' }}><FormattedMessage id="Editor.loadingProduct" /></div>}
        {name && (
          <a href={productHref} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center' }}>{name}</h3>
          </a>
        )}
        {description2 && <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginBottom: '1rem', fontStyle: 'italic' }}>{description2}</p>}
        {imageUrl && (
          <a href={productHref} style={{ display: 'block', marginBottom: '1rem' }}>
            <img
              src={imageUrl}
              alt={name || 'Product'}
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'block' }}
            />
          </a>
        )}
        {priceVal && (
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#2c5530',
              background: 'rgba(255,255,255,0.8)',
              padding: '0.5rem 1rem',
              borderRadius: '2px',
              marginBottom: '0.5rem',
            }}
          >
            {formatPrice(priceVal.centAmount, priceVal.currencyCode, priceVal.fractionDigits)}
          </span>
        )}
        {sku && (
          <span style={{ fontSize: '0.85rem', color: '#666', background: 'rgba(255,255,255,0.6)', padding: '0.25rem 0.75rem', borderRadius: '2px' }}>
            <FormattedMessage id="Editor.skuLabel" values={{ sku }} />
          </span>
        )}
        {!loading && !p && (
          <div style={{ color: '#999', fontSize: '13px', padding: '2rem', textAlign: 'center' }}>
            <FormattedMessage id="Editor.noProductSelected" />
          </div>
        )}
      </div>
    </div>
  );
};

export const createProductBannerConfig = (
  intl: IntlShape
): ComponentConfig<ProductBannerProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.productBanner.label' }),
  fields: {
    title: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.productBanner.field.title' }) },
    description: richTextField(intl.formatMessage({ id: 'Editor.cfg.productBanner.field.description' })),
    ctaText: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.productBanner.field.ctaText' }) },
    ctaLink: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.productBanner.field.ctaLink' }) },
    product: {
      type: 'custom', label: intl.formatMessage({ id: 'Editor.cfg.productBanner.field.product' }),
      render: ({ value, onChange }) => <DatasourceField value={value} onChange={onChange} />,
    },
    productOnLeft: {
      type: 'radio', label: intl.formatMessage({ id: 'Editor.cfg.productBanner.field.productOnLeft' }),
      options: [
        { value: false, label: intl.formatMessage({ id: 'Editor.cfg.productBanner.productPosition.right' }) },
        { value: true, label: intl.formatMessage({ id: 'Editor.cfg.productBanner.productPosition.left' }) },
      ],
    },
    background: {
      type: 'custom',
      label: intl.formatMessage({ id: 'Editor.cfg.productBanner.field.background' }),
      render: ({ value, onChange }) => <ColorPickerField value={value} onChange={onChange} />,
    },
    ...createProductLinkFields(intl),
  },
  defaultProps: {
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    product: { type: 'product-by-sku', skus: [''] },
    productOnLeft: false,
    background: '#f5f5f5',
    ...productLinkDefaults,
  },
  render: (props) => <ProductBannerRender {...props} />,
});
