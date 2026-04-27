import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import { ImagePickerField } from '../../fields/ImagePickerField';

export interface EmptyStateProps {
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export const EmptyState: ComponentConfig<EmptyStateProps> = {
  label: 'Empty State',
  fields: {
    image: {
      type: 'custom', label: 'Image',
      render: ({ value, onChange }) => <ImagePickerField value={value ?? ''} onChange={onChange} />,
    },
    title: { type: 'text', label: 'Title' },
    description: { type: 'text', label: 'Description' },
    ctaText: { type: 'text', label: 'CTA Text' },
    ctaLink: { type: 'text', label: 'CTA Link' },
  },
  defaultProps: { image: '', title: '', description: '', ctaText: '', ctaLink: '' },
  render: ({ image, title, description, ctaText, ctaLink }) => (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      {image && (
        <img
          src={image}
          alt={title || 'Empty state'}
          style={{ maxWidth: '200px', height: 'auto', marginBottom: '1.5rem', opacity: 0.8 }}
        />
      )}
      {title && <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '0.5rem' }}>{title}</h2>}
      {description && (
        <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
          {description}
        </p>
      )}
      {ctaText && ctaLink && (
        <a
          href={ctaLink}
          style={{
            display: 'inline-block',
            background: '#2c5530',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          {ctaText}
        </a>
      )}
    </div>
  ),
};
