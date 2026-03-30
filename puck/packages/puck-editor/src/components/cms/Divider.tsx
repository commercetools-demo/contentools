import React from 'react';
import { type ComponentConfig } from '@measured/puck';

export interface DividerProps {
  lineStyle: 'solid' | 'dashed' | 'dotted';
  spacing: string;
}

export const Divider: ComponentConfig<DividerProps> = {
  label: 'Divider',
  fields: {
    lineStyle: {
      type: 'select',
      label: 'Line Style',
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ],
    },
    spacing: { type: 'text', label: 'Spacing (px)' },
  },
  defaultProps: { lineStyle: 'solid', spacing: '24' },
  render: ({ lineStyle, spacing }) => {
    const s = parseInt(spacing, 10) || 24;
    return (
      <hr
        style={{
          border: 'none',
          borderTop: `1px ${lineStyle} #ddd`,
          margin: `${s / 2}px 0`,
        }}
      />
    );
  },
};
