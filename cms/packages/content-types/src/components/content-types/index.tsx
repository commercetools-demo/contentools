import { useStateContentType } from '@commercetools-demo/cms-state';
import React, { useEffect } from 'react';
import ContentTypeList from '../content-type-list';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ContentTypeData } from '@commercetools-demo/cms-types';

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

  const {
    fetchContentTypes,
    clearError,
    contentTypes,
    error,
    removeContentType,
  } = useStateContentType();

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await removeContentType(key);
    clearError();
  };

  const handleCreateNew = () => {
    history.push(`new-content-type`);
  };

  const handleEdit = (item: ContentTypeData) => {
    history.push(`content-type/${item.key}`);
  };

  // Load data on mount
  useEffect(() => {
    loadItems();
  }, [baseURL, businessUnitKey]);

  const loadItems = async () => {
    await fetchContentTypes();
    clearError();
  };

  if (!contentTypes) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  // Show error state
  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <ContentTypeList
      items={contentTypes}
      baseURL={baseURL}
      businessUnitKey={businessUnitKey}
      error={error}
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default ContentTypesApp;
