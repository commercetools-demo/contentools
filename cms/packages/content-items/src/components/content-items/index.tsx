import {
  useStateContentItem,
} from '@commercetools-demo/cms-state';
import {
  ContentItem
} from '@commercetools-demo/cms-types';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ContentItemList } from '../content-item-list/content-item-list';
import styles from './index.module.css';
interface ContentItemAppProps {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
}

const ContentItemApp: React.FC<ContentItemAppProps> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale = 'en-US',
}) => {
  const history = useHistory();

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

  // Load data on mount
  useEffect(() => {
    loadItems();
  }, [baseURL, businessUnitKey]);

  const loadItems = async () => {
    await fetchContentItems(hydratedUrl);
    clearError();
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    clearError();
    await deleteContentItem(hydratedUrl, key);
  };

  const handleCreateNew = () => {
    history.push(`new-content-item`);
  };

  const handleEdit = (item: ContentItem) => {
    history.push(`content-item/${item.key}`);
  };


  // Show loading state
  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.errorContainer}>{error}</div>
    );
  }

  return (
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
  );
};

export default ContentItemApp;
