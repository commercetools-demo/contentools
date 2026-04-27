import React from 'react';
import type { ComponentConfig } from '@measured/puck';

export interface SpacerProps {
  height?: string;
  showLine?: boolean;
  lineColor?: string;
}

export const Spacer: ComponentConfig<SpacerProps> = {
  label: 'Spacer',
  fields: {
    height: { type: 'text', label: 'Height (CSS, e.g. 48px)' },
    showLine: {
      type: 'radio',
      label: 'Show Divider Line',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    lineColor: { type: 'text', label: 'Line Color (CSS color)' },
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
};
