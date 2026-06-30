import React from 'react';
import type { ComponentConfig } from '@measured/puck';
import { RichTextField } from '../fields/RichTextField';
import { sanitizeHtml } from '../utils/sanitizeHtml';

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
      type: 'custom',
      label: 'Content',
      render: ({ value, onChange }) => (
        <RichTextField value={value as string} onChange={onChange} />
      ),
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
      // HTML from the rich-text editor, sanitized before injection
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  ),
};
