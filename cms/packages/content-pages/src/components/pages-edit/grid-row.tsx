import React, { useCallback } from 'react';
import { ContentItem } from '@commercetools-demo/contentools-types';
import styled from 'styled-components';
import GridCell from './grid-cell';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';

interface GridCellData {
  id: string;
  contentItemKey: string | null;
  colSpan: number;
}

interface GridRowData {
  id: string;
  cells: GridCellData[];
}

interface GridRowProps {
  row: GridRowData;
  rowIndex: number;
  components: ContentItem[];
  selectedCell: { rowId: string; cellId: string } | null;
  readonly?: boolean;
  onCellClick: (rowId: string, cellId: string, componentId?: string) => void;
  onRemoveRow: (rowId: string) => void;
  onIncreaseWidth: (rowId: string, cellId: string) => void;
  onDecreaseWidth: (rowId: string, cellId: string) => void;
  onComponentToCurrentPage: (rowId: string, cellId: string) => Promise<void>;
}

const RowContent = styled.div`
  max-width: 100%;
  width: 100%;
  overflow-x: auto;
  display: flex;
  position: relative;
  gap: 5px;
`;

const RowHeader = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;



const GridRow: React.FC<GridRowProps> = ({
  row,
  rowIndex,
  components,
  selectedCell,
  readonly = false,
  onComponentToCurrentPage,
  onCellClick,
  onRemoveRow,
  onIncreaseWidth,
  onDecreaseWidth,
}) => {
  const getComponentForCell = useCallback((contentItemKey: string | null): ContentItem | undefined => {
    if (!contentItemKey) return undefined;
    return components.find(c => c?.key === contentItemKey);
  }, [components, row]);

  const isSelected = (cellId: string): boolean => {
    return !!(
      selectedCell &&
      selectedCell.rowId === row.id &&
      selectedCell.cellId === cellId
    );
  };

  const handleCellClick = (cellId: string, contentItemKey?: string) => {
    onCellClick(row.id, cellId, contentItemKey);
  };

  const handleRemoveRow = () => {
    if (!readonly) {
      onRemoveRow(row.id);
    }
  };

  const handleIncreaseWidth = (cellId: string) => {
    onIncreaseWidth(row.id, cellId);
  };

  const handleDecreaseWidth = (cellId: string) => {
    onDecreaseWidth(row.id, cellId);
  };

  const handleComponentToCurrentPage = (cellId: string) => {
    return onComponentToCurrentPage(row.id, cellId);
  };


  return (
    <div data-row-id={row.id}>
      {!readonly && (
        <RowHeader>
          <span>Row {rowIndex + 1}</span>
          <IconButton 
            onClick={handleRemoveRow} 
            title="Remove row"
            label="Remove row"
            icon={<BinLinearIcon  color='primary'  size='small'/>}
           />
        </RowHeader>
      )}
      
      <RowContent>
        {row.cells.map(cell => {
          const contentItem = getComponentForCell(cell.contentItemKey);
          
          return (
            <GridCell
              key={cell.id}
              cellId={cell.id}
              rowId={row.id}
              colSpan={cell.colSpan}
              contentItem={contentItem ?? null}
              selected={isSelected(cell.id)}
              readonly={readonly}
              rowCells={row.cells}
              onCellClick={handleCellClick}
              onIncreaseWidth={handleIncreaseWidth}
              onDecreaseWidth={handleDecreaseWidth}
              onComponentToCurrentPage={handleComponentToCurrentPage}
            />
          );
        })}
      </RowContent>
    </div>
  );
};

export default GridRow;
