import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
import { ImagePickerField } from '../../fields/ImagePickerField';

export interface WebsiteLogoProps {
  logo: string;
  maxWidth: string;
  maxHeight: string;
}

export const createWebsiteLogoConfig = (
  intl: IntlShape
): ComponentConfig<WebsiteLogoProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.websiteLogo.label' }),
  fields: {
    logo: {
      type: 'custom', label: intl.formatMessage({ id: 'Editor.cfg.websiteLogo.field.logo' }),
      render: ({ value, onChange }) => <ImagePickerField value={value ?? ''} onChange={onChange} />,
    },
    maxWidth: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.websiteLogo.field.maxWidth' }) },
    maxHeight: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.websiteLogo.field.maxHeight' }) },
  },
  defaultProps: { logo: '', maxWidth: '180', maxHeight: '50' },
  render: ({ logo, maxWidth, maxHeight }) => {
    if (!logo) return (
      <div style={{ width: `${parseInt(maxWidth, 10) || 180}px`, height: `${parseInt(maxHeight, 10) || 50}px`, background: '#f0f0f0', borderRadius: '4px' }} />
    );
    return (
      <div
        style={{
          maxWidth: `${parseInt(maxWidth, 10) || 180}px`,
          maxHeight: `${parseInt(maxHeight, 10) || 50}px`,
        }}
      >
        <img
          src={logo}
          alt={intl.formatMessage({ id: 'Editor.websiteLogoAlt' })}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  },
});
