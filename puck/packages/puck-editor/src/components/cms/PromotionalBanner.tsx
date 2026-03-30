import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import { ImagePickerField } from '../../fields/ImagePickerField';

export interface PromotionalBannerProps {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  background: string;
}

export const PromotionalBanner: ComponentConfig<PromotionalBannerProps> = {
  label: 'Promotional Banner',
  fields: {
    image: {
      type: 'custom', label: 'Image',
      render: ({ value, onChange }) => <ImagePickerField value={value ?? ''} onChange={onChange} />,
    },
    title: { type: 'text', label: 'Title' },
    subtitle: { type: 'text', label: 'Subtitle' },
    ctaText: { type: 'text', label: 'CTA Text' },
    ctaLink: { type: 'text', label: 'CTA Link' },
    background: { type: 'text', label: 'Background Color' },
  },
  defaultProps: { image: '', title: '', subtitle: '', ctaText: '', ctaLink: '', background: '#f5f5f5' },
  render: ({ image, title, subtitle, ctaText, ctaLink, background }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '280px',
        backgroundColor: background || '#f5f5f5',
        padding: '2rem',
        borderRadius: '2px',
        margin: '1rem 0',
        gap: '2rem',
        flexWrap: 'wrap',
      }}
    >
      {image && (
        <div style={{ flex: '0 0 auto', maxWidth: '40%' }}>
          <img src={image} alt={title || 'Promo'} style={{ maxWidth: '100%', height: 'auto', borderRadius: '2px' }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: '200px' }}>
        {title && <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>{title}</h2>}
        {subtitle && <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>{subtitle}</p>}
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
    </div>
  ),
};
