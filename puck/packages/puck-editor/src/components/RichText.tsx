import React from 'react';
import type { ComponentConfig } from '@measured/puck';

export interface RichTextProps {
  content: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: string;
  padding?: string;
}

export const RichText: ComponentConfig<RichTextProps> = {
  label: 'Rich Text',
  fields: {
    content: {
      type: 'textarea',
      label: 'Content (HTML supported)',
    },
    align: {
      type: 'select',
      label: 'Text Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
    },
    maxWidth: { type: 'text', label: 'Max Width (CSS)' },
    padding: { type: 'text', label: 'Padding (CSS)' },
  },
  defaultProps: {
    content: '<p>Add your content here…</p>',
    align: 'left',
    padding: '32px',
  },
  render: ({ content, align, maxWidth, padding }) => (
    <div
      style={{
        padding: padding ?? '32px',
        textAlign: align ?? 'left',
        maxWidth: maxWidth,
        margin: maxWidth ? '0 auto' : undefined,
        boxSizing: 'border-box',
      }}
      // Puck stores raw HTML for rich text fields; this is controlled editor input
      dangerouslySetInnerHTML={{ __html: content }}
    />
  ),
};
