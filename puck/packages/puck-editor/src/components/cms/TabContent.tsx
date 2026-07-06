import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
import { richTextField } from '../../fields/RichTextField';
import { RichTextContent } from '../RichTextContent';

export interface TabContentProps {
  tabLabel: string;
  content: string;
}

export const createTabContentConfig = (
  intl: IntlShape
): ComponentConfig<TabContentProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.tabContent.label' }),
  fields: {
    tabLabel: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.tabContent.field.tabLabel' }) },
    content: richTextField(intl.formatMessage({ id: 'Editor.cfg.tabContent.field.content' })),
  },
  defaultProps: { tabLabel: '', content: '' },
  render: ({ tabLabel, content }) => {
    if (!content) return <></>;
    return (
      <div style={{ padding: '1.5rem 0', lineHeight: 1.6, color: '#333' }}>
        {tabLabel && <h3 style={{ marginBottom: '1rem' }}>{tabLabel}</h3>}
        <RichTextContent html={content} />
      </div>
    );
  },
});
