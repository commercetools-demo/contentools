import React from 'react';
import type { ComponentConfig } from '@measured/puck';

export interface HeroProps {
  heading: string;
  subheading?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  layout?: 'centered' | 'left-aligned';
  minHeight?: string;
}

export const Hero: ComponentConfig<HeroProps> = {
  label: 'Hero',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    subheading: { type: 'textarea', label: 'Subheading' },
    backgroundImage: { type: 'text', label: 'Background Image URL' },
    ctaText: { type: 'text', label: 'CTA Button Text' },
    ctaUrl: { type: 'text', label: 'CTA Button URL' },
    layout: {
      type: 'select',
      label: 'Layout',
      options: [
        { value: 'centered', label: 'Centered' },
        { value: 'left-aligned', label: 'Left Aligned' },
      ],
    },
    minHeight: { type: 'text', label: 'Min Height (CSS, e.g. 400px)' },
  },
  defaultProps: {
    heading: 'Welcome',
    layout: 'centered',
    minHeight: '400px',
  },
  render: ({
    heading,
    subheading,
    backgroundImage,
    ctaText,
    ctaUrl,
    layout,
    minHeight,
  }) => {
    const isCenter = layout !== 'left-aligned';
    return (
      <section
        style={{
          position: 'relative',
          minHeight: minHeight ?? '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCenter ? 'center' : 'flex-start',
          padding: '48px 32px',
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: backgroundImage ? undefined : '#1a1a2e',
          color: '#fff',
          boxSizing: 'border-box',
        }}
      >
        {backgroundImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
            }}
          />
        )}
        <div
          style={{
            position: 'relative',
            maxWidth: '720px',
            textAlign: isCenter ? 'center' : 'left',
          }}
        >
          <h1 style={{ margin: '0 0 16px', fontSize: '2.5rem', fontWeight: 700 }}>
            {heading}
          </h1>
          {subheading && (
            <p style={{ margin: '0 0 24px', fontSize: '1.2rem', opacity: 0.85 }}>
              {subheading}
            </p>
          )}
          {ctaText && ctaUrl && (
            <a
              href={ctaUrl}
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#e94560',
                color: '#fff',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {ctaText}
            </a>
          )}
        </div>
      </section>
    );
  },
};
