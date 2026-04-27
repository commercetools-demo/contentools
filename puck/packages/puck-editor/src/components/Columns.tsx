import React from 'react';
import { DropZone, type ComponentConfig } from '@measured/puck';

export interface ColumnsProps {
  columnCount?: 2 | 3 | 4;
  gap?: string;
  padding?: string;
}

export const Columns: ComponentConfig<ColumnsProps> = {
  label: 'Columns',
  fields: {
    columnCount: {
      type: 'select',
      label: 'Number of Columns',
      options: [
        { value: 2, label: '2 Columns' },
        { value: 3, label: '3 Columns' },
        { value: 4, label: '4 Columns' },
      ],
    },
    gap: { type: 'text', label: 'Column Gap (CSS)' },
    padding: { type: 'text', label: 'Padding (CSS)' },
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
};
