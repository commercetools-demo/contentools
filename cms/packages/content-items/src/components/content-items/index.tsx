import {
  getAllContentTypesMetaData,
  useStateContentItem,
  useStateStateManagement,
  useStateVersion,
} from '@commercetools-demo/cms-state';
import {
  ContentItem,
  ContentTypeMetaData,
  RootState,
} from '@commercetools-demo/cms-types';
import React, { useEffect, useState } from 'react';
import { ContentItemList } from '../content-item-list/content-item-list';
import styles from './index.module.css';
import { useModalState } from '@commercetools-frontend/application-components';
import ContentTypeModal from '../content-type-modal/content-type-modal';
import ContentItemEditor from '../content-item-editor/content-item-editor';

interface ContentItemAppProps {
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
}

const ContentItemApp: React.FC<ContentItemAppProps> = ({
  baseURL,
  businessUnitKey,
  locale = 'en-US',
}) => {
  // const dispatch = useDispatch<AppDispatch>();

  const { items, loading, error, states, fetchContentItems, clearError, updateContentItem, deleteContentItem } = useStateContentItem();
  const { fetchVersions, saveVersion } = useStateVersion();
  const { fetchStates, saveDraft, publish, revertToPublished } = useStateStateManagement();

  const contentTypeModalState = useModalState();
  const contentItemEditorState = useModalState();
  // Local state
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [contentTypesMetaData, setContentTypesMetaData] = useState<
    ContentTypeMetaData[]
  >([]);
  const [contentTypesLoading, setContentTypesLoading] = useState(true);
  const [contentTypesError, setContentTypesError] = useState<string | null>(
    null
  );

  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  // Load data on mount
  useEffect(() => {
    loadItems();
    loadContentTypes();
  }, [baseURL, businessUnitKey]);

  const loadItems = async () => {
    await fetchContentItems(hydratedUrl);
    clearError();
  };

  const loadContentTypes = async () => {
    try {
      setContentTypesLoading(true);
      setContentTypesError(null);
      const metaData = await getAllContentTypesMetaData({ baseURL });
      setContentTypesMetaData(metaData);
    } catch (err) {
      setContentTypesError(
        `Failed to load component types: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error('Error loading component types:', err);
    } finally {
      setContentTypesLoading(false);
    }
  };

  const handleSave = async (item: ContentItem) => {
    clearError();
    if (item) {
      const component = {
        ...selectedItem,
        ...item,
      };

      if (component) {
        // if (view === 'new') {
        //   const newItem = {
        //     ...component,
        //     key: `item-${uuidv4()}`,
        //   };
        //   setSelectedItem(newItem);
        //   dispatch(
        //     createContentItem({
        //       baseURL: hydratedUrl,
        //       businessUnitKey,
        //       item: newItem,
        //     })
        //   );
        //   setView('list');
        // } else {
        await updateContentItem(hydratedUrl, component.key, component);
        // }

        await handleSaveVersion();
        await handleSaveDraft(component);

        // After updating, refresh versions and states
        await fetchVersions(hydratedUrl, component.key, 'content-items');

        await fetchStates(hydratedUrl, component.key, 'content-items');

        await fetchContentItems(hydratedUrl);
      }
    } else {
      console.error('No item to save');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    clearError();
    await deleteContentItem(hydratedUrl, key);
  };

  const handleContentTypeSelect = (
    contentTypeMetaData: ContentTypeMetaData
  ) => {
    contentTypeModalState.closeModal();
    // setView('new');
    setSelectedItem({
      type: contentTypeMetaData.type,
      name: '',
      properties: contentTypeMetaData.defaultProperties,
      businessUnitKey,
    } as ContentItem);
  };



  const handleSaveVersion = async () => {
    if (selectedItem) {
      return saveVersion(
          hydratedUrl,
          selectedItem,
          selectedItem.key,
          'content-items',
        )
      
    }
  };

  const handleFetchStates = async (key: string, contentType: string) => {
    if (key && contentType) {
      await fetchStates(hydratedUrl, key, contentType as 'content-items' | 'pages');
    }
  };

  const handleSaveDraft = (updatedItem: ContentItem) => {
    if (selectedItem) {
      return saveDraft(
        hydratedUrl,
        updatedItem,
        selectedItem.key,
        'content-items',
      );
    }
  };

  const handlePublish = async (params: {
    item: ContentItem;
    key: string;
    contentType: string;
    clearDraft?: boolean;
  }) => {
    const { item, key, contentType, clearDraft = false } = params;
    if (item && key && contentType) {
      await publish(hydratedUrl, item, key, contentType as 'content-items' | 'pages', clearDraft);
    }
  };

  const handleRevert = async (params: { key: string; contentType: string }) => {
    const { key, contentType } = params;
    if (key && contentType) {
      await revertToPublished(hydratedUrl, key, contentType as 'content-items' | 'pages');
    }
  };

  const handleCreateNew = () => {
    contentTypeModalState.openModal();
  };

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    contentItemEditorState.openModal();
  };

  const handleBack = () => {
    // setView('list');
    contentTypeModalState.openModal();
    setSelectedItem(null);
  };

  // Show loading state
  if (loading && contentTypesLoading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  // Show error state
  if (error || contentTypesError) {
    return (
      <div className={styles.errorContainer}>{error || contentTypesError}</div>
    );
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
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ContentTypeModal
        contentTypesMetaData={contentTypesMetaData}
        onSelect={handleContentTypeSelect}
        isOpen={contentTypeModalState.isModalOpen}
        onClose={contentTypeModalState.closeModal}
      />

      <ContentItemEditor
        isOpen={contentItemEditorState.isModalOpen}
        onClose={contentItemEditorState.closeModal}
        item={selectedItem}
        isNew={!selectedItem}
        locale={locale}
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
        onSave={handleSave}
        onPublish={handlePublish}
        onRevert={handleRevert}
      />
    </>
  );
};

export default ContentItemApp;