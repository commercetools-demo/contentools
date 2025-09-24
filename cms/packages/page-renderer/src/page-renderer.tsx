import { GridRow, GridCell } from '@commercetools-demo/contentools-types';
import { ContextualRenderer } from '@commercetools-demo/contentools-content-item-renderer';
import React, { PropsWithChildren } from 'react';
import { PageRendererProps } from '.';

/**
 * PageGridRenderer - Renders complete pages with layout grids and components
 *
 * This component takes a Page and renders it according to its layout configuration.
 * It creates a grid structure where each cell can contain a content item component.
 * The layout is responsive and follows the defined grid structure from the page.
 */
const PageGridRenderer: React.FC<
  PropsWithChildren<
    Pick<
      PageRendererProps,
      'baseURL' | 'page' | 'locale' | 'className' | 'style' | 'onError'
    >
  >
> = ({
  page,
  baseURL = '',
  locale = 'en-US',
  className,
  style,
  onError,
  children,
}) => {
  if (!page) {
    console.error('Page is required for PageGridRenderer');
    return children || null;
  }

  const renderCell = (cell: GridCell, rowIndex: number, cellIndex: number) => {
    const cellStyle: React.CSSProperties = {
      gridColumn: `span ${cell.colSpan || 1}`,
      minHeight: '100px', // Ensure cells have some minimum height
    };

    // If cell has a content item, render it
    if (cell.contentItemKey) {
      // Find the content item in the page's components
      const contentItem = page.components?.find(
        (component) => component.key === cell.contentItemKey
      );

      if (contentItem) {
        return (
          <div
            key={`cell-${rowIndex}-${cellIndex}`}
            style={cellStyle}
            className="page-grid-cell"
          >
            <ContextualRenderer
              component={contentItem}
              baseURL={baseURL}
              locale={locale}
              onError={onError}
            />
          </div>
        );
      }
    }

    // Empty cell
    return (
      <div
        key={`cell-${rowIndex}-${cellIndex}`}
        style={cellStyle}
        className="page-grid-cell page-grid-cell--empty"
      />
    );
  };

  const renderRow = (row: GridRow, rowIndex: number) => {
    // Calculate total columns for this row
    const totalColumns = row.cells.reduce(
      (sum, cell) => sum + (cell.colSpan || 1),
      0
    );

    const rowStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.max(totalColumns, 12)}, 1fr)`, // Minimum 12 columns for responsive grid
      gap: 'var(--page-grid-gap, 1rem)',
      marginBottom: 'var(--page-grid-row-margin, 1rem)',
    };

    return (
      <div key={`row-${rowIndex}`} style={rowStyle} className="page-grid-row">
        {row.cells.map((cell, cellIndex) =>
          renderCell(cell, rowIndex, cellIndex)
        )}
      </div>
    );
  };

  return (
    <div className={`page-renderer ${className || ''}`} style={style}>
      {/* Page metadata could be rendered here if needed */}
      <div className="page-content">
        {page.layout?.rows?.map((row, rowIndex) => renderRow(row, rowIndex)) ||
          null}
      </div>
    </div>
  );
};

// Default export
export default PageGridRenderer;
