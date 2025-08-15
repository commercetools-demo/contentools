import { useStateContentType } from '@commercetools-demo/contentools-state';
import React, { useEffect, useState } from 'react';
import ContentTypeList from '../content-type-list';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ContentTypeData } from '@commercetools-demo/contentools-types';
import {
  ConfirmationModal,
  useModalState,
} from '@commercetools-demo/contentools-ui-components';
import Text from '@commercetools-uikit/text';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

type Props = {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const ContentTypesApp = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale,
}: Props) => {
  const history = useHistory();
  const deleteModal = useModalState();
  const [selectedItem, setSelectedItem] = useState<ContentTypeData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const {
    fetchContentTypes,
    clearError,
    contentTypes,
    error,
    removeContentType,
  } = useStateContentType();

  const handleDeleteConfirmation = async (key: string) => {
    setIsLoading(true);
    await removeContentType(key);
    clearError();
    setIsLoading(false);
    loadItems();
    deleteModal.closeModal();
  };

  const handleDeleteModalOpen = (key: string) => {
    setSelectedItem(contentTypes?.find((item) => item.key === key) || null);
    deleteModal.openModal();
  };

  const handleCreateNew = () => {
    history.push(`new-content-type`);
  };

  const handleEdit = (item: ContentTypeData) => {
    history.push(`content-type/${item.key}`);
  };

  const loadItems = async () => {
    await fetchContentTypes();
    clearError();
  };

  // Load data on mount
  useEffect(() => {
    loadItems();
  }, [baseURL, businessUnitKey]);

  if (!contentTypes) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // Show error state
  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <>
      <ContentTypeList
        items={contentTypes}
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
        error={error}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDeleteModalOpen}
      />
      <ConfirmationModal
        isOpen={deleteModal.isModalOpen}
        onClose={deleteModal.closeModal}
        onConfirm={() => handleDeleteConfirmation(selectedItem?.key || '')}
        onReject={deleteModal.closeModal}
        confirmTitle="Delete"
        rejectTitle="Cancel"
        loading={isLoading}
      >
        <Text.Body>
          Are you sure you want to delete content-type with key{' '}
          <Text.Body as="span" fontWeight="bold">
            {selectedItem?.key}
          </Text.Body>
          ?
        </Text.Body>
      </ConfirmationModal>
    </>
  );
};

export default ContentTypesApp;
