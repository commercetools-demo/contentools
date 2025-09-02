import React from 'react';
import { ContentItem } from '@commercetools-demo/contentools-types';
import styled from 'styled-components';
import GridCell from './grid-cell';

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
  baseURL: string;
  businessUnitKey: string;
  locale: string;
  rowIndex: number;
  components: ContentItem[];
  selectedCell: { rowId: string; cellId: string } | null;
  readonly?: boolean;
  onCellClick: (rowId: string, cellId: string, componentId?: string) => void;
  onRemoveRow: (rowId: string) => void;
  onIncreaseWidth: (rowId: string, cellId: string) => void;
  onDecreaseWidth: (rowId: string, cellId: string) => void;
  activeComponentType?: any;
}

const RowContent = styled.div`
  max-width: 100%;
  width: 100%;
  overflow-x: auto;
  display: flex;
  position: relative;
  gap: 15px;
`;

const RowHeader = styled.div`
  background: rgba(0, 0, 0, 0.05);
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(231, 76, 60, 0.1);
  }
`;

const GridRow: React.FC<GridRowProps> = ({
  row,
  baseURL,
  businessUnitKey,
  locale,
  rowIndex,
  components,
  selectedCell,
  readonly = false,
  onCellClick,
  onRemoveRow,
  onIncreaseWidth,
  onDecreaseWidth,
  activeComponentType,
}) => {
  const getComponentForCell = (contentItemKey: string | null): ContentItem | undefined => {
    if (!contentItemKey) return undefined;
    return components.find(c => c.key === contentItemKey);
  };

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


  return (
    <div data-row-id={row.id}>
      {!readonly && (
        <RowHeader>
          <span>Row {rowIndex + 1}</span>
          <RemoveButton 
            onClick={handleRemoveRow} 
            title="Remove row"
          >
            ✕
          </RemoveButton>
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
              baseURL={baseURL}
              businessUnitKey={businessUnitKey}
              locale={locale}
              colSpan={cell.colSpan}
              contentItem={contentItem ?? null}
              selected={isSelected(cell.id)}
              readonly={readonly}
              rowCells={row.cells}
              onCellClick={handleCellClick}
              onIncreaseWidth={handleIncreaseWidth}
              onDecreaseWidth={handleDecreaseWidth}
              activeComponentType={activeComponentType}
            />
          );
        })}
      </RowContent>
    </div>
  );
};

export default GridRow;
