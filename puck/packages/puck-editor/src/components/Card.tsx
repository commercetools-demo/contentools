import React from 'react';
import type { ComponentConfig } from '@measured/puck';

export interface CardProps {
  title: string;
  body?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  shadow?: boolean;
  borderRadius?: string;
}

export const Card: ComponentConfig<CardProps> = {
  label: 'Card',
  fields: {
    title: { type: 'text', label: 'Title' },
    body: { type: 'textarea', label: 'Body Text' },
    imageUrl: { type: 'text', label: 'Image URL' },
    ctaText: { type: 'text', label: 'CTA Text' },
    ctaUrl: { type: 'text', label: 'CTA URL' },
    shadow: {
      type: 'radio',
      label: 'Drop Shadow',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    borderRadius: { type: 'text', label: 'Border Radius (CSS)' },
  },
  defaultProps: {
    title: 'Card Title',
    body: 'Card description goes here.',
    shadow: true,
    borderRadius: '8px',
  },
  render: ({ title, body, imageUrl, ctaText, ctaUrl, shadow, borderRadius }) => (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: borderRadius ?? '8px',
        overflow: 'hidden',
        boxShadow: shadow ? '0 2px 8px rgba(0,0,0,0.12)' : undefined,
        background: '#fff',
        margin: '8px',
        boxSizing: 'border-box',
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
        />
      )}
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>{title}</h3>
        {body && <p style={{ margin: '0 0 16px', color: '#555', fontSize: '14px' }}>{body}</p>}
        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            style={{
              color: '#e94560',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            {ctaText} →
          </a>
        )}
      </div>
    </div>
  ),
};
