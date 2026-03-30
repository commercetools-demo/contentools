import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import { ImagePickerField } from '../../fields/ImagePickerField';

export interface WebsiteLogoProps {
  logo: string;
  maxWidth: string;
  maxHeight: string;
}

export const WebsiteLogo: ComponentConfig<WebsiteLogoProps> = {
  label: 'Website Logo',
  fields: {
    logo: {
      type: 'custom', label: 'Logo',
      render: ({ value, onChange }) => <ImagePickerField value={value ?? ''} onChange={onChange} />,
    },
    maxWidth: { type: 'text', label: 'Max Width (px)' },
    maxHeight: { type: 'text', label: 'Max Height (px)' },
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
          alt="Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  },
};
