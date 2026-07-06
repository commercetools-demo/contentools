import React from 'react';
import type { ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
import { RichTextField } from '../fields/RichTextField';
import { RichTextContent } from './RichTextContent';
import { createFontSizeField } from '../fields/fontSizeField';

export interface CardProps {
  title: string;
  titleFontSize?: string;
  body?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  shadow?: boolean;
  borderRadius?: string;
}

export const createCardConfig = (intl: IntlShape): ComponentConfig<CardProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.card.label' }),
  fields: {
    title: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.card.field.title' }) },
    titleFontSize: createFontSizeField(intl, intl.formatMessage({ id: 'Editor.cfg.card.field.titleFontSize' })),
    body: {
      type: 'custom',
      label: intl.formatMessage({ id: 'Editor.cfg.card.field.body' }),
      render: ({ value, onChange }) => (
        <RichTextField value={value as string} onChange={onChange} />
      ),
    },
    imageUrl: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.card.field.imageUrl' }) },
    ctaText: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.card.field.ctaText' }) },
    ctaUrl: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.card.field.ctaUrl' }) },
    shadow: {
      type: 'radio',
      label: intl.formatMessage({ id: 'Editor.cfg.card.field.shadow' }),
      options: [
        { value: true, label: intl.formatMessage({ id: 'Editor.cfg.yesNo.yes' }) },
        { value: false, label: intl.formatMessage({ id: 'Editor.cfg.yesNo.no' }) },
      ],
    },
    borderRadius: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.card.field.borderRadius' }) },
  },
  defaultProps: {
    title: 'Card Title',
    body: 'Card description goes here.',
    shadow: true,
    borderRadius: '8px',
  },
  render: ({ title, titleFontSize, body, imageUrl, ctaText, ctaUrl, shadow, borderRadius }) => (
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
        <h3 style={{ margin: '0 0 8px', fontSize: titleFontSize || '1.1rem' }}>{title}</h3>
        {body && (
          <RichTextContent
            html={body}
            style={{ margin: '0 0 16px', color: '#555', fontSize: '14px' }}
          />
        )}
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
});
