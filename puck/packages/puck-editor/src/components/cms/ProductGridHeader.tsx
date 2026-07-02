import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
import { richTextField } from '../../fields/RichTextField';

export interface ProductGridHeaderProps {
  title: string;
  description: string;
}

export const createProductGridHeaderConfig = (
  intl: IntlShape
): ComponentConfig<ProductGridHeaderProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.productGridHeader.label' }),
  fields: {
    title: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.productGridHeader.field.title' }) },
    description: richTextField(intl.formatMessage({ id: 'Editor.cfg.productGridHeader.field.description' })),
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
});
