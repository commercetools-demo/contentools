import {
  NUMBER_OF_COLUMNS,
  useStateContentType,
  useStatePages,
} from '@commercetools-demo/contentools-state';
import {
  ContentItem,
  ContentTypeData,
  StateInfo,
} from '@commercetools-demo/contentools-types';
import { StateTag } from '@commercetools-demo/contentools-ui-components';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { MoveContentItemParams } from '@commercetools-demo/contentools-types';

interface GridCellProps {
  baseURL: string;
  businessUnitKey: string;
  cellId: string;
  rowId: string;
  contentItem: ContentItem | null;
  colSpan: number;
  selected: boolean;
  readonly?: boolean;
  rowCells: Array<{
    id: string;
    contentItemKey: string | null;
    colSpan: number;
  }>;
  isIncreaseDisabled: boolean;
  onCellClick: (cellId: string, contentItemKey?: string) => void;
  onIncreaseWidth: (cellId: string, colSpan: number) => void;
  onDecreaseWidth: (cellId: string, colSpan: number) => void;
  activeComponentType?: any;
  onComponentToCurrentPage: (cellId: string) => Promise<void>;
  onMoveContentItem: (params: MoveContentItemParams) => Promise<void>;
}

const CellContainer = styled.div<{
  colWidth: number;
  selected: boolean;
  readonly?: boolean;
}>`
  flex: 0 1 ${(props) => props.colWidth}%;
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: ${(props) => (props.readonly ? '0' : '15px')};
  background-color: ${(props) => (props.readonly ? 'transparent' : '#f9f9f9')};
  min-height: 100px;
  position: relative;
  transition: all 0.2s;
  cursor: ${(props) => (props.readonly ? 'default' : 'pointer')};

  &.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 14px;
  }

  &.has-component {
    border-style: solid;
    background-color: white;
  }

  &.selected {
    border-color: ${(props) => (props.selected ? '#007acc' : 'transparent')};
    box-shadow: ${(props) =>
      props.selected ? '0 0 0 2px rgba(0, 122, 204, 0.2)' : 'none'};
  }

  &.readonly {
    border-color: transparent;
  }

  &.drag-over {
    border-color: #007acc;
    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.5);
    background-color: rgba(0, 122, 204, 0.1);
  }

  &:hover .cell-resize {
    opacity: 1;
  }
`;

const ComponentCard = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80px;
`;

const DraggableWrapper = styled.div<{ $readonly?: boolean }>`
  width: 100%;
  cursor: ${(props) => (props.$readonly ? 'default' : 'grab')};
  transition: opacity 0.2s;

  &:active {
    cursor: ${(props) => (props.$readonly ? 'default' : 'grabbing')};
  }
`;

const CellResize = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s;
`;

const ResizeButton = styled.button<{ disabled?: boolean }>`
  background: ${(props) => (props.disabled ? '#bdc3c7' : '#007acc')};
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const EmptyText = styled.span`
  color: #999;
  font-size: 14px;
`;

const GridCell: React.FC<GridCellProps> = ({
  baseURL,
  businessUnitKey,
  cellId,
  rowId,
  colSpan,
  contentItem,
  selected,
  readonly = false,
  rowCells,
  onCellClick,
  onIncreaseWidth,
  onDecreaseWidth,
  isIncreaseDisabled,
  onComponentToCurrentPage,
  onMoveContentItem,
}) => {
  const colWidth = (colSpan / NUMBER_OF_COLUMNS) * 100;
  const hasComponent = !!contentItem;

  const [currentState, setCurrentState] =
    useState<StateInfo<ContentItem> | null>(null);

  const [contentType, setContentType] = useState<ContentTypeData | null>(null);
  const { fetchItemState } = useStatePages()!;
  const { fetchContentType } = useStateContentType()!;
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  const handleClick = () => {
    if (!readonly) {
      onCellClick(cellId, contentItem?.key);
    }
  };

  const handleIncreaseWidth = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIncreaseWidth(cellId, colSpan + 1);
  };

  const handleDecreaseWidth = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDecreaseWidth(cellId, colSpan - 1);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (readonly || !hasComponent || !contentItem) return;

    // Set drag data with source information
    const dragData = {
      sourceRowId: rowId,
      sourceCellId: cellId,
      contentItemKey: contentItem.key,
      type: 'move-component',
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';

    // Add visual feedback
    (e.currentTarget as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (readonly) return;

    // Reset visual feedback
    (e.currentTarget as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (readonly || hasComponent) return;

    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (readonly) return;

    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (readonly || hasComponent) return;

    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');

    try {
      // Try to parse drag data to check if it's a move operation
      const dragDataStr = e.dataTransfer.getData('application/json');

      if (dragDataStr) {
        const dragData = JSON.parse(dragDataStr);

        if (dragData.type === 'move-component') {
          // Moving an existing component
          await onMoveContentItem({
            sourceRowId: dragData.sourceRowId,
            sourceCellId: dragData.sourceCellId,
            targetRowId: rowId,
            targetCellId: cellId,
            contentItemKey: dragData.contentItemKey,
          });
        }
      } else {
        // Adding a new component to the page (from sidebar)
        await onComponentToCurrentPage(cellId);
      }
    } catch (error) {
      // If parsing fails, assume it's a new component drop
      await onComponentToCurrentPage(cellId);
    }
  };

  const isDecreaseDisabled = useMemo(() => {
    return readonly || colSpan <= 1;
  }, [readonly, colSpan]);

  useEffect(() => {
    if (contentItem?.key) {
      fetchItemState(hydratedUrl, contentItem.key).then((result) => {
        setCurrentState(result.states);
      });
    }
    if (contentItem?.type) {
      fetchContentType(contentItem.type).then(setContentType);
    }
  }, [contentItem?.key, fetchItemState]);

  // In readonly mode, only render cells with components
  if (readonly && !hasComponent) {
    return null;
  }

  return (
    <CellContainer
      colWidth={colWidth}
      selected={selected}
      readonly={readonly}
      className={`${hasComponent ? 'has-component' : 'empty'} ${
        selected ? 'selected' : ''
      } ${readonly ? 'readonly' : ''}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-cell-id={cellId}
      data-component-id={contentItem?.id || ''}
    >
      {hasComponent ? (
        <DraggableWrapper
          draggable={!readonly}
          $readonly={readonly}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <ComponentCard>
            <Spacings.Inline scale="s">
              <Spacings.Stack scale="s" alignItems="flex-start">
                {currentState && <StateTag status={currentState} isCondensed />}
                <Text.Subheadline as="h4" nowrap>
                  {contentType?.metadata.name}
                </Text.Subheadline>
                <Text.Detail nowrap>{contentItem?.name}</Text.Detail>
              </Spacings.Stack>
            </Spacings.Inline>
          </ComponentCard>
        </DraggableWrapper>
      ) : !readonly ? (
        <EmptyText>Drop component here</EmptyText>
      ) : null}

      {!readonly && (
        <CellResize className="cell-resize">
          <ResizeButton
            onClick={handleDecreaseWidth}
            disabled={isDecreaseDisabled}
            title="Decrease width"
          >
            -
          </ResizeButton>
          <ResizeButton
            onClick={handleIncreaseWidth}
            disabled={isIncreaseDisabled || colSpan >= NUMBER_OF_COLUMNS}
            title="Increase width"
          >
            +
          </ResizeButton>
        </CellResize>
      )}
    </CellContainer>
  );
};

export default GridCell;
