import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import { richTextField } from '../../fields/RichTextField';

export interface TabContentProps {
  tabLabel: string;
  content: string;
}

export const TabContent: ComponentConfig<TabContentProps> = {
  label: 'Tab Content',
  fields: {
    tabLabel: { type: 'text', label: 'Tab Label' },
    content: richTextField('Content'),
  },
  defaultProps: { tabLabel: '', content: '' },
  render: ({ tabLabel, content }) => {
    if (!content) return <></>;
    return (
      <div style={{ padding: '1.5rem 0', lineHeight: 1.6, color: '#333' }}>
        {tabLabel && <h3 style={{ marginBottom: '1rem' }}>{tabLabel}</h3>}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  },
};
