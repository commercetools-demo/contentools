import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '@commercetools-demo/contentools-ui-components';
import {
  useStateContentType,
  useStateEditor,
} from '@commercetools-demo/contentools-state';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import IconButton from '@commercetools-uikit/icon-button';
import { CloseIcon } from '@commercetools-uikit/icons';
import styled from 'styled-components';
import { ContentTypeData } from '@commercetools-demo/contentools-types';
import { ContentTypeCard } from '@commercetools-demo/contentools-ui-components';

const DEBOUNCE_MS = 300;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ComponentLibraryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
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

const SearchInputWrapper = styled.div<{ $hasClear?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  & input {
    padding-right: ${(p) => (p.$hasClear ? '36px' : '12px')};
  }
`;

const SearchClearButton = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
`;

const ComponentLibraryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { contentTypes, loading, error, fetchContentTypes } =
    useStateContentType();
  const editorState = useStateEditor();
  const setDraggingComponentType = editorState?.setDraggingComponentType;
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && !contentTypes?.length && !loading) {
      fetchContentTypes();
    }
  }, [isOpen, contentTypes, loading, fetchContentTypes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredContentTypes = useMemo(() => {
    if (!contentTypes) return [];
    const query = debouncedSearchQuery.toLowerCase();
    if (!query) return contentTypes;
    return contentTypes.filter(
      (ct: ContentTypeData) =>
        ct.key.toLowerCase().includes(query) ||
        ct.metadata?.name?.toLowerCase().includes(query)
    );
  }, [contentTypes, debouncedSearchQuery]);

  const handleDragStart = (contentType: ContentTypeData) => {
    setDraggingItemId(contentType.id);
    setDraggingComponentType?.(contentType.key);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleDragEnd = () => {
    setDraggingItemId(null);
    setDraggingComponentType?.(null);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Component Library"
      size={30}
    >
      <Spacings.Stack scale="m">
        <SearchInputWrapper $hasClear={searchQuery.length > 0}>
          <TextInput
            value={searchQuery}
            onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            placeholder="Search components..."
            hasError={false}
            isDisabled={false}
          />
          {searchQuery.length > 0 && (
            <SearchClearButton>
              <IconButton
                icon={<CloseIcon />}
                label="Clear search"
                onClick={handleClearSearch}
                size="medium"
              />
            </SearchClearButton>
          )}
        </SearchInputWrapper>

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
            {filteredContentTypes.map((contentType) => (
              <ContentTypeCard
                key={contentType.id}
                contentType={contentType}
                className={draggingItemId === contentType.id ? 'dragging' : ''}
                draggable
                onDragStart={() => handleDragStart(contentType)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </ComponentLibraryGrid>
        )}

        {contentTypes && contentTypes.length === 0 && !loading && (
          <ErrorContainer>
            <Text.Body tone="secondary">No content types available</Text.Body>
          </ErrorContainer>
        )}

        {contentTypes &&
          contentTypes.length > 0 &&
          filteredContentTypes.length === 0 &&
          !loading && (
            <ErrorContainer>
              <Text.Body tone="secondary">
                No components match your search
              </Text.Body>
            </ErrorContainer>
        )}
      </Spacings.Stack>
    </Modal>
  );
};

export default ComponentLibraryModal;
