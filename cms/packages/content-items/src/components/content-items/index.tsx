import { useStateContentItem } from '@commercetools-demo/contentools-state';
import { ContentItem } from '@commercetools-demo/contentools-types';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ContentItemList } from '../content-item-list/content-item-list';
import styles from './index.module.css';
import {
  ConfirmationModal,
  useModalState,
} from '@commercetools-demo/contentools-ui-components';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styled from 'styled-components';
import Text from '@commercetools-uikit/text';

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
interface ContentItemAppProps {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const ContentItemApp: React.FC<ContentItemAppProps> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale = 'en-US',
  backButton,
}) => {
  const history = useHistory();
  const deleteModal = useModalState();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    items,
    loading,
    error,
    states,
    fetchContentItems,
    clearError,
    deleteContentItem,
  } = useStateContentItem();

  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  const loadItems = async () => {
    await fetchContentItems(hydratedUrl);
    clearError();
  };

  const handleDeleteConfirmation = async (key: string) => {
    setIsLoading(true);
    await deleteContentItem(hydratedUrl, key);
    clearError();
    setIsLoading(false);
    loadItems();
    deleteModal.closeModal();
  };

  const handleDeleteModalOpen = (key: string) => {
    setSelectedItem(items?.find((item) => item.key === key) || null);
    deleteModal.openModal();
  };

  const handleCreateNew = () => {
    history.push(`new-content-item`);
  };

  const handleEdit = (item: ContentItem) => {
    history.push(`content-item/${item.key}`);
  };

  useEffect(() => {
    loadItems();
  }, [baseURL, businessUnitKey]);

  // Show loading state
  if (loading) {
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
      <ContentItemList
        items={items}
        states={states}
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
        loading={loading}
        error={error}
        backButton={backButton}
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
          Are you sure you want to delete content-item with name{' '}
          <Text.Body as="span" fontWeight="bold">
            {selectedItem?.name}
          </Text.Body>
          ?
        </Text.Body>
      </ConfirmationModal>
    </>
  );
};

export default ContentItemApp;
