import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';

export interface DividerProps {
  lineStyle: 'solid' | 'dashed' | 'dotted';
  spacing: string;
}

export const createDividerConfig = (
  intl: IntlShape
): ComponentConfig<DividerProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.divider.label' }),
  fields: {
    lineStyle: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.divider.field.lineStyle' }),
      options: [
        { value: 'solid', label: intl.formatMessage({ id: 'Editor.cfg.divider.lineStyle.solid' }) },
        { value: 'dashed', label: intl.formatMessage({ id: 'Editor.cfg.divider.lineStyle.dashed' }) },
        { value: 'dotted', label: intl.formatMessage({ id: 'Editor.cfg.divider.lineStyle.dotted' }) },
      ],
    },
    spacing: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.divider.field.spacing' }) },
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
});
