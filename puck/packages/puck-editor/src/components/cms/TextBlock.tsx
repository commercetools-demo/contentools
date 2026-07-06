import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
import { RichTextField } from '../../fields/RichTextField';
import { RichTextContent } from '../RichTextContent';

export interface TextBlockProps {
  content: string;
}

export const createTextBlockConfig = (
  intl: IntlShape
): ComponentConfig<TextBlockProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.textBlock.label' }),
  fields: {
    content: {
      type: 'custom',
      label: intl.formatMessage({ id: 'Editor.cfg.textBlock.field.content' }),
      render: ({ value, onChange }) => (
        <RichTextField value={value as string} onChange={onChange} />
      ),
    },
  },
  defaultProps: { content: '' },
  render: ({ content }) => {
    if (!content) return <></>;
    return (
      <RichTextContent
        html={content}
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
});
