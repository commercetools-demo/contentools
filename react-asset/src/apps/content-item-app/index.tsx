import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { ContentItemList } from './components/content-item-list';
import { 
  clearError,
  createContentItem,
  deleteContentItem,
  fetchContentItems,
  updateContentItem,
} from '@/store/content-item.slice';
import { fetchStates, publish, revertToPublished, saveDraft } from '@/store/state.slice';
import { fetchVersions, saveVersion } from '@/store/version.slice';
import { 
  ContentItem, 
  ContentTypeMetaData, 
  RootState, 
  StateInfo 
} from '@/types';
import { getAllContentTypesMetaData } from '@/utils/content-type-utility';
import { AppDispatch } from '@/store';
import styles from './index.module.css';

interface ContentItemAppProps {
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
}


const ContentItemApp: React.FC<ContentItemAppProps> = ({ 
  baseURL, 
  businessUnitKey, 
  locale = 'en-US' 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const items = useSelector((state: RootState) => state.contentItem.items);
  const loading = useSelector((state: RootState) => state.contentItem.loading);
  const error = useSelector((state: RootState) => state.contentItem.error);
  const states = useSelector((state: RootState) => state.contentItem.states);
  
  // Local state
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showContentTypeModal, setShowContentTypeModal] = useState(false);
  const [contentTypesMetaData, setContentTypesMetaData] = useState<ContentTypeMetaData[]>([]);
  const [contentTypesLoading, setContentTypesLoading] = useState(true);
  const [contentTypesError, setContentTypesError] = useState<string | null>(null);

  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  // Load data on mount
  useEffect(() => {
    loadItems();
    loadContentTypes();
  }, [baseURL, businessUnitKey]);

  const loadItems = async () => {
    dispatch(clearError());
    dispatch(fetchContentItems(hydratedUrl));
  };

  const loadContentTypes = async () => {
    try {
      setContentTypesLoading(true);
      setContentTypesError(null);
      const metaData = await getAllContentTypesMetaData({ baseURL });
      setContentTypesMetaData(metaData);
    } catch (err) {
      setContentTypesError(
        `Failed to load component types: ${err instanceof Error ? err.message : String(err)}`
      );
      console.error('Error loading component types:', err);
    } finally {
      setContentTypesLoading(false);
    }
  };

  const handleSave = async (item: { component: ContentItem }) => {
    dispatch(clearError());
    if (item) {
      const component = {
        ...selectedItem,
        ...item.component,
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
          await dispatch(
            updateContentItem({ 
              baseURL: hydratedUrl, 
              key: component.key, 
              item: component 
            })
          );
        // }
        
        await handleSaveVersion();
        await handleSaveDraft(component);
        
        // After updating, refresh versions and states
        dispatch(
          fetchVersions({
            baseURL: hydratedUrl,
            key: component.key,
            contentType: 'content-items',
          })
        );

        dispatch(
          fetchStates({
            baseURL: hydratedUrl,
            key: component.key,
            contentType: 'content-items',
          })
        );
        
        dispatch(fetchContentItems(hydratedUrl));
      }
    } else {
      console.error('No item to save');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    dispatch(clearError());
    await dispatch(deleteContentItem({ baseURL: hydratedUrl, key }));
    dispatch(fetchContentItems(hydratedUrl));
  };

  const handleContentTypeSelect = (contentTypeMetaData: ContentTypeMetaData) => {
    setShowContentTypeModal(false);
    // setView('new');
    setSelectedItem({
      type: contentTypeMetaData.type,
      name: '',
      properties: contentTypeMetaData.defaultProperties,
      businessUnitKey,
    } as ContentItem);
  };

  const handleFetchVersions = (params: { baseURL: string; key: string; contentType: string }) => {
    const { key, contentType } = params;
    if (key && contentType) {
      dispatch(
        fetchVersions({
          baseURL: hydratedUrl,
          key,
          contentType,
        })
      );
    }
  };

  const handleSaveVersion = () => {
    if (selectedItem) {
      return dispatch(
        saveVersion({
          baseURL: hydratedUrl,
          data: selectedItem,
          key: selectedItem.key,
          contentType: 'content-items',
        })
      );
    }
  };

  const handleFetchStates = (params: { baseURL: string; key: string; contentType: string }) => {
    const { key, contentType } = params;
    if (key && contentType) {
      dispatch(
        fetchStates({
          baseURL: hydratedUrl,
          key,
          contentType,
        })
      );
    }
  };

  const handleSaveDraft = (updatedItem: ContentItem) => {
    if (selectedItem) {
      return dispatch(
        saveDraft({
          baseURL: hydratedUrl,
          data: updatedItem,
          key: selectedItem.key,
          contentType: 'content-items',
        })
      );
    }
  };

  const handlePublish = (params: { 
    item: ContentItem; 
    key: string; 
    contentType: string; 
    clearDraft?: boolean 
  }) => {
    const { item, key, contentType, clearDraft = false } = params;
    if (item && key && contentType) {
      dispatch(
        publish({
          baseURL: hydratedUrl,
          key,
          contentType,
        })
      );
    }
  };

  const handleRevert = (params: { key: string; contentType: string }) => {
    const { key, contentType } = params;
    if (key && contentType) {
      dispatch(
        revertToPublished({
          baseURL: hydratedUrl,
          key,
          contentType,
        })
      );
    }
  };

  const handleCreateNew = () => {
    setShowContentTypeModal(true);
  };

  const handleEdit = (item: ContentItem) => {
    // setView('editor');
    setSelectedItem(item);
  };

  const handleBack = () => {
    // setView('list');
    setSelectedItem(null);
  };

  // Show loading state
  if (loading && contentTypesLoading) {
    return (
      <div className={styles.loadingContainer}>
        Loading...
      </div>
    );
  }

  // Show error state
  if (error || contentTypesError) {
    return (
      <div className={styles.errorContainer}>
        {error || contentTypesError}
      </div>
    );
  }


  return (
    <div className={styles.container}>
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

    </div>
  );
};

export default ContentItemApp;