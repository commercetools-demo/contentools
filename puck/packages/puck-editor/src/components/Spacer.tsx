import React from 'react';
import type { ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';

export interface SpacerProps {
  height?: string;
  showLine?: boolean;
  lineColor?: string;
}

export const createSpacerConfig = (intl: IntlShape): ComponentConfig<SpacerProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.spacer.label' }),
  fields: {
    height: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.spacer.field.height' }) },
    showLine: {
      type: 'radio',
      label: intl.formatMessage({ id: 'Editor.cfg.spacer.field.showLine' }),
      options: [
        { value: true, label: intl.formatMessage({ id: 'Editor.cfg.yesNo.yes' }) },
        { value: false, label: intl.formatMessage({ id: 'Editor.cfg.yesNo.no' }) },
      ],
    },
    lineColor: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.spacer.field.lineColor' }) },
  },
  defaultProps: {
    height: '48px',
    showLine: false,
    lineColor: '#e0e0e0',
  },
  render: ({ height = '48px', showLine = false, lineColor = '#e0e0e0' }) => (
    <div
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        boxSizing: 'border-box',
      }}
    >
      {showLine && (
        <hr style={{ width: '100%', border: 'none', borderTop: `1px solid ${lineColor}` }} />
      )}
    </div>
  ),
});
