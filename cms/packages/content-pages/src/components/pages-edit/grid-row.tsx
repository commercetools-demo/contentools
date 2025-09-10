import React, { useCallback, useMemo } from 'react';
import { ContentItem } from '@commercetools-demo/contentools-types';
import styled from 'styled-components';
import GridCell from './grid-cell';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import { NUMBER_OF_COLUMNS } from '@commercetools-demo/contentools-state';
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
  baseURL: string;
  businessUnitKey: string;
  row: GridRowData;
  rowIndex: number;
  components: ContentItem[];
  selectedCell: { rowId: string; cellId: string } | null;
  readonly?: boolean;
  onCellClick: (rowId: string, cellId: string, componentId?: string) => void;
  onRemoveRow: (rowId: string) => void;
  onIncreaseWidth: (rowId: string, cellId: string, colSpan: number) => void;
  onDecreaseWidth: (rowId: string, cellId: string, colSpan: number) => void;
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

const StyledGridRow = styled.div`
  padding: 10px;
`;

const GridRow: React.FC<GridRowProps> = ({
  baseURL,
  businessUnitKey,
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

  const isIncreaseDisabled = useMemo(() => {
    return row.cells.reduce((acc, cell) => acc + cell.colSpan, 0) > NUMBER_OF_COLUMNS || !row.cells.some(cell => cell.colSpan === 1);
  }, [row.cells]);


  const handleCellClick = (cellId: string, contentItemKey?: string) => {
    onCellClick(row.id, cellId, contentItemKey);
  };

  const handleRemoveRow = () => {
    if (!readonly) {
      onRemoveRow(row.id);
    }
  };

  const handleIncreaseWidth = (cellId: string, colSpan: number) => {
    onIncreaseWidth(row.id, cellId, colSpan);
  };

  const handleDecreaseWidth = (cellId: string, colSpan: number) => {
    onDecreaseWidth(row.id, cellId, colSpan);
  };

  const handleComponentToCurrentPage = (cellId: string) => {
    return onComponentToCurrentPage(row.id, cellId);
  };


  return (
    <StyledGridRow data-row-id={row.id}>
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
              baseURL={baseURL}
              businessUnitKey={businessUnitKey}
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
              isIncreaseDisabled={isIncreaseDisabled}
            />
          );
        })}
      </RowContent>
    </StyledGridRow>
  );
};

export default GridRow;
