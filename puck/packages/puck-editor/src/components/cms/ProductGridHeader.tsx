import React from 'react';
import { type ComponentConfig } from '@measured/puck';

export interface ProductGridHeaderProps {
  title: string;
  description: string;
}

export const ProductGridHeader: ComponentConfig<ProductGridHeaderProps> = {
  label: 'Product Grid Header',
  fields: {
    title: { type: 'text', label: 'Title' },
    description: { type: 'textarea', label: 'Description (HTML)' },
  },
  defaultProps: { title: '', description: '' },
  render: ({ title, description }) => (
    <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
      {title && (
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.75rem' }}>
          {title}
        </h1>
      )}
      {description && (
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          style={{ fontSize: '1rem', color: '#666', lineHeight: 1.5, maxWidth: '720px' }}
        />
      )}
    </div>
  ),
};
