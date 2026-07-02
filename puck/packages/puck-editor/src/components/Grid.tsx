import React from 'react';
import { DropZone, type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';

export interface GridProps {
  columnCount?: 1 | 2 | 3 | 4 | 5 | 6;
  rowCount?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: string;
  padding?: string;
}

const COUNT_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: n,
  label: String(n),
}));

/**
 * Grid — a layout container that lays out a `columnCount` × `rowCount` matrix
 * of drop zones. Each cell is an independent Puck DropZone, so components can be
 * dropped into any cell. (Renamed from "Columns"; rows added.)
 *
 * This render function is shared by the editor and the Puck renderer
 * (puck-renderer runs the same config), so updating it here updates both.
 */
export const createGridConfig = (intl: IntlShape): ComponentConfig<GridProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.grid.label' }),
  fields: {
    columnCount: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.grid.field.columnCount' }),
      options: COUNT_OPTIONS,
    },
    rowCount: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.grid.field.rowCount' }),
      options: COUNT_OPTIONS,
    },
    gap: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.grid.field.gap' }) },
    padding: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.grid.field.padding' }) },
  },
  defaultProps: {
    columnCount: 2,
    rowCount: 1,
    gap: '16px',
    padding: '16px',
  },
  render: ({ columnCount = 2, rowCount = 1, gap = '16px', padding = '16px' }) => {
    const cols = Math.max(1, columnCount);
    const rows = Math.max(1, rowCount);
    const cells = Array.from({ length: cols * rows }, (_, i) => i);
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, minmax(40px, auto))`,
          gap,
          padding,
          boxSizing: 'border-box',
        }}
      >
        {cells.map((i) => (
          <div key={i}>
            {/* Cells are indexed row-major: cell-0 = row 0 col 0, etc. */}
            <DropZone zone={`cell-${i}`} />
          </div>
        ))}
      </div>
    );
  },
});
