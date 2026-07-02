import React from 'react';
import type { ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
import { RichTextField } from '../fields/RichTextField';
import { sanitizeHtml } from '../utils/sanitizeHtml';

export interface RichTextProps {
  content: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: string;
  padding?: string;
}

export const createRichTextConfig = (intl: IntlShape): ComponentConfig<RichTextProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.richText.label' }),
  fields: {
    content: {
      type: 'custom',
      label: intl.formatMessage({ id: 'Editor.cfg.richText.field.content' }),
      render: ({ value, onChange }) => (
        <RichTextField value={value as string} onChange={onChange} />
      ),
    },
    align: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.richText.field.align' }),
      options: [
        { value: 'left', label: intl.formatMessage({ id: 'Editor.cfg.align.left' }) },
        { value: 'center', label: intl.formatMessage({ id: 'Editor.cfg.align.center' }) },
        { value: 'right', label: intl.formatMessage({ id: 'Editor.cfg.align.right' }) },
      ],
    },
    maxWidth: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.richText.field.maxWidth' }) },
    padding: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.richText.field.padding' }) },
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
});
