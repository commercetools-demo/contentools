import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';

export interface CheckoutPromoBannerProps {
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
}

export const createCheckoutPromoBannerConfig = (
  intl: IntlShape
): ComponentConfig<CheckoutPromoBannerProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.checkoutPromoBanner.label' }),
  fields: {
    title: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.checkoutPromoBanner.field.title' }) },
    message: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.checkoutPromoBanner.field.message' }) },
    ctaText: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.checkoutPromoBanner.field.ctaText' }) },
    ctaLink: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.checkoutPromoBanner.field.ctaLink' }) },
  },
  defaultProps: { title: '', message: '', ctaText: '', ctaLink: '' },
  render: ({ title, message, ctaText, ctaLink }) => {
    if (!title && !message && !ctaText) return <></>;
    return (
      <div
        style={{
          padding: '1rem 1.25rem',
          background: '#f0f7f0',
          border: '1px solid #c8e6c8',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.95rem',
        }}
      >
        {title && (
          <div style={{ fontWeight: 600, color: '#2c5530', marginBottom: '0.25rem' }}>
            {title}
          </div>
        )}
        {message && <p style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{message}</p>}
        {ctaText && ctaLink && (
          <a href={ctaLink} style={{ color: '#2c5530', fontWeight: 600, textDecoration: 'none' }}>
            {ctaText}
          </a>
        )}
      </div>
    );
  },
});
