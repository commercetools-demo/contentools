import React, { useEffect, useState } from 'react';
import { Modal } from '@commercetools-demo/contentools-ui-components';
import { useStateContentType, useStateEditor } from '@commercetools-demo/contentools-state';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styled from 'styled-components';
import { ContentTypeData } from '@commercetools-demo/contentools-types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ComponentLibraryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const ComponentItem = styled.div`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: grab;
  background: white;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    border-color: #007acc;
    background: #f0f8ff;
  }

  &:active {
    cursor: grabbing;
  }

  &.dragging {
    opacity: 0.5;
    transform: rotate(2deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 20px;
  color: #e74c3c;
`;

const ComponentLibraryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { contentTypes, loading, error, fetchContentTypes } = useStateContentType();
  const editorState = useStateEditor();
  const setDraggingComponentType = editorState?.setDraggingComponentType;
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !contentTypes?.length && !loading) {
      fetchContentTypes();
    }
  }, [isOpen, contentTypes, loading, fetchContentTypes]);

  const handleDragStart = (contentType: ContentTypeData) => {
    setDraggingItemId(contentType.id);
    setDraggingComponentType?.(contentType.key);
    // Close modal after a short delay to allow drag to start
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleDragEnd = () => {
    setDraggingItemId(null);
    setDraggingComponentType?.(null);
  };

  const renderContentTypeItem = (contentType: ContentTypeData) => (
    <ComponentItem
      key={contentType.id}
      className={draggingItemId === contentType.id ? 'dragging' : ''}
      draggable
      onDragStart={() => handleDragStart(contentType)}
      onDragEnd={handleDragEnd}
    >
      
      <Spacings.Stack scale="xs">
        <Text.Subheadline as="h4">
          {contentType.metadata.icon && (
            <span style={{ marginRight: '8px' }}>{contentType.metadata.icon}</span>
          )}
          {contentType.metadata.name}
        </Text.Subheadline>
        <Text.Detail tone="secondary">
          {contentType.metadata.type}
        </Text.Detail>
        <Text.Detail tone="secondary">
          <small>{Object.keys(contentType.metadata.propertySchema || {}).length} properties</small>
        </Text.Detail>
      </Spacings.Stack>
    </ComponentItem>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Component Library"
      size={30}
    >
      <Spacings.Stack scale="m">
        <Text.Body tone="secondary">
          Drag components to add them to your page
        </Text.Body>

        {loading && (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <Text.Body tone="critical">{error}</Text.Body>
          </ErrorContainer>
        )}

        {contentTypes && contentTypes.length > 0 && (
          <ComponentLibraryGrid>
            {contentTypes.map(renderContentTypeItem)}
          </ComponentLibraryGrid>
        )}

        {contentTypes && contentTypes.length === 0 && !loading && (
          <ErrorContainer>
            <Text.Body tone="secondary">No content types available</Text.Body>
          </ErrorContainer>
        )}
      </Spacings.Stack>
    </Modal>
  );
};

export default ComponentLibraryModal;
