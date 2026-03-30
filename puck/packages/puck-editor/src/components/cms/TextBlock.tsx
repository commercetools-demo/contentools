import React from 'react';
import { type ComponentConfig } from '@measured/puck';

export interface TextBlockProps {
  content: string;
}

export const TextBlock: ComponentConfig<TextBlockProps> = {
  label: 'Text Block',
  fields: {
    content: { type: 'textarea', label: 'Content (HTML)' },
  },
  defaultProps: { content: '' },
  render: ({ content }) => {
    if (!content) return null;
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '1.5rem 1rem',
          lineHeight: 1.6,
          color: '#333',
        }}
      />
    );
  },
};
