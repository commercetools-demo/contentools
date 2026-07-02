import React from 'react';
import { DropZone, type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';

export interface ColumnsProps {
  columnCount?: 2 | 3 | 4;
  gap?: string;
  padding?: string;
}

/**
 * @deprecated Use `Grid` instead (columns + rows). `Columns` is kept registered
 * for backward compatibility so pages saved with the original component (and its
 * `column-N` drop zones) keep rendering. Prefer Grid for new content.
 */
export const createColumnsConfig = (intl: IntlShape): ComponentConfig<ColumnsProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.columns.label' }),
  fields: {
    columnCount: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.columns.field.columnCount' }),
      options: [
        { value: 2, label: intl.formatMessage({ id: 'Editor.cfg.columns.count.2' }) },
        { value: 3, label: intl.formatMessage({ id: 'Editor.cfg.columns.count.3' }) },
        { value: 4, label: intl.formatMessage({ id: 'Editor.cfg.columns.count.4' }) },
      ],
    },
    gap: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.columns.field.gap' }) },
    padding: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.columns.field.padding' }) },
  },
  defaultProps: {
    columnCount: 2,
    gap: '16px',
    padding: '16px',
  },
  render: ({ columnCount = 2, gap = '16px', padding = '16px' }) => {
    const cols = Array.from({ length: columnCount }, (_, i) => i);
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap,
          padding,
          boxSizing: 'border-box',
        }}
      >
        {cols.map((i) => (
          <div key={i}>
            <DropZone zone={`column-${i}`} />
          </div>
        ))}
      </div>
    );
  },
});
