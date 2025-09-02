import React, { useState, useCallback } from 'react';
import { Page } from '@commercetools-demo/contentools-types';
import Text from '@commercetools-uikit/text';
import styled from 'styled-components';
import GridRow from './grid-row';

/**
 * Refactored PagesGridLayout component that renders a custom grid system
 * instead of react-grid-layout. The grid is structured as:
 * 
 * - Page contains layout with rows
 * - Each row contains cells with configurable column spans
 * - Each cell can contain a component or be empty (droppable)
 * - Cells are expandable/shrinkable with +/- controls
 * - Follows 12-column grid system from constants
 */

interface Props {
  page: Page;
  selectedContentItemKey: string | null;
  onComponentSelect: (componentId: string | null) => void;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
  activeComponentType?: string | null;
}

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EmptyGridMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  margin: 40px 0;
`;

const GridControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
`;

const PagesGridLayout: React.FC<Props> = ({
  page,
  selectedContentItemKey,
  onComponentSelect,
  baseURL,
  businessUnitKey,
  locale,
  activeComponentType = null,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ rowId: string; cellId: string } | null>(null);

  // Sync selectedCell with selectedComponentId
  const handleCellClick = useCallback((rowId: string, cellId: string, contentItemKey?: string) => {
    setSelectedCell({ rowId, cellId });
    if (contentItemKey) {
      onComponentSelect(contentItemKey);
    } else {
      onComponentSelect(null);
    }
  }, [onComponentSelect]);

  // Update selectedCell when selectedComponentId changes externally
  React.useEffect(() => {
    if (selectedContentItemKey) {
      // Find the cell that contains this component
      for (const row of page.layout.rows) {
        for (const cell of row.cells) {
          if (cell.contentItemKey === selectedContentItemKey) {
            setSelectedCell({ rowId: row.id, cellId: cell.id });
            return;
          }
        }
      }
    } else {
      setSelectedCell(null);
    }
  }, [selectedContentItemKey, page.layout.rows]);

  const handleRemoveRow = useCallback((rowId: string) => {
    // This would dispatch an action to remove the row from the page layout
    console.log('Remove row:', rowId);
  }, []);

  const handleIncreaseWidth = useCallback((rowId: string, cellId: string) => {
    // This would dispatch an action to increase cell width
    console.log('Increase width:', { rowId, cellId });
  }, []);

  const handleDecreaseWidth = useCallback((rowId: string, cellId: string) => {
    // This would dispatch an action to decrease cell width
    console.log('Decrease width:', { rowId, cellId });
  }, []);



  return (
    <>
      <GridControls>
        <div>
          <Text.Subheadline as="h4">Page Layout</Text.Subheadline>
          <Text.Detail tone="secondary">
            Rows: {page.layout.rows.length} | Components: {page.components.length}
          </Text.Detail>
        </div>
      </GridControls>

      {page.layout.rows.length === 0 ? (
        <EmptyGridMessage>
          <Text.Subheadline as="h4">No layout rows found</Text.Subheadline>
          <Text.Detail tone="secondary">
            Add rows and components to start building your page layout.
          </Text.Detail>
        </EmptyGridMessage>
      ) : (
        <GridContainer>
          {page.layout.rows.map((row, index) => (
            <GridRow
              key={row.id}
              row={row}
              baseURL={baseURL}
              businessUnitKey={businessUnitKey}
              locale={locale}
              rowIndex={index}
              components={page.components}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
              onRemoveRow={handleRemoveRow}
              onIncreaseWidth={handleIncreaseWidth}
              onDecreaseWidth={handleDecreaseWidth}
              activeComponentType={activeComponentType}
            />
          ))}
        </GridContainer>
      )}
    </>
  );
};

export default PagesGridLayout;
