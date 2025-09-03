import { useStatePages } from '@commercetools-demo/contentools-state';
import Text from '@commercetools-uikit/text';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import GridRow from './grid-row';
import { themes } from '@commercetools-uikit/design-system';

interface Props {
  baseURL: string;
  businessUnitKey: string;
  selectedContentItemKey: string | null;
  onComponentSelect: (componentId: string | null) => void;
  onComponentToCurrentPage: (rowId: string, cellId: string) => Promise<void>;
}

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  & > div {
    &:nth-child(2n+1) {
      background: ${themes.default.colorNeutral98};
      &:hover {
        background: ${themes.default.colorNeutral85};
      }
    }
    &:nth-child(2n) {
      background: ${themes.default.colorNeutral95};
      &:hover {
        background: ${themes.default.colorNeutral85};
      }
    }
  }
`;

const EmptyGridMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  margin: 40px 0;
`;

const PagesGridLayout: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  selectedContentItemKey,
  onComponentSelect,
  onComponentToCurrentPage,
}) => {
  const { currentPage: page, removeRowFromCurrentPage } = useStatePages()!;
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const [selectedCell, setSelectedCell] = useState<{
    rowId: string;
    cellId: string;
  } | null>(null);

  // Sync selectedCell with selectedComponentId
  const handleCellClick = useCallback(
    (rowId: string, cellId: string, contentItemKey?: string) => {
      setSelectedCell({ rowId, cellId });
      if (contentItemKey) {
        onComponentSelect(contentItemKey);
      } else {
        onComponentSelect(null);
      }
    },
    [onComponentSelect]
  );

  // Update selectedCell when selectedComponentId changes externally
  React.useEffect(() => {
    if (selectedContentItemKey) {
      // Find the cell that contains this component
      for (const row of page?.layout.rows || []) {
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
  }, [selectedContentItemKey, page?.layout.rows]);

  const handleRemoveRow = useCallback((rowId: string) => {
    // This would dispatch an action to remove the row from the page layout
    removeRowFromCurrentPage(hydratedUrl, rowId);
  }, [hydratedUrl, removeRowFromCurrentPage]);

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
      {page?.layout.rows.length === 0 ? (
        <EmptyGridMessage>
          <Text.Subheadline as="h4">No layout rows found</Text.Subheadline>
          <Text.Detail tone="secondary">
            Add rows and components to start building your page layout.
          </Text.Detail>
        </EmptyGridMessage>
      ) : (
        <GridContainer>
          {page?.layout.rows.map((row, index) => (
            <GridRow
              key={row.id}
              row={row}
              rowIndex={index}
              components={page.components}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
              onRemoveRow={handleRemoveRow}
              onIncreaseWidth={handleIncreaseWidth}
              onDecreaseWidth={handleDecreaseWidth}
              onComponentToCurrentPage={onComponentToCurrentPage}
            />
          ))}
        </GridContainer>
      )}
    </>
  );
};

export default PagesGridLayout;
