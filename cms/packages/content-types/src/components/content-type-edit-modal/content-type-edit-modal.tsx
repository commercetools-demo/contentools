import {
  ContentTypeData,
  ContentTypeMetaData,
} from '@commercetools-demo/cms-types';
import { Modal, useModalState } from '@commercetools-demo/cms-ui-components';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { useStateContentType } from '@commercetools-demo/cms-state';
import ContentTypeForm from '../content-type-form';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ContentTypeEditModal: React.FC<{
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}> = ({ parentUrl, baseURL, businessUnitKey, locale }) => {
  const { contentTypeKey } = useParams<{ contentTypeKey: string }>();
  const history = useHistory();
  const match = useRouteMatch();
  const contentTypeModalState = useModalState(true);
  const { fetchContentType, error, updateContentType } = useStateContentType();
  const [contentType, setContentType] = useState<ContentTypeData | null>(null);
  
  const handleClose = () => {
    contentTypeModalState.closeModal();
    history.goBack();
  };

  const handleUpdate = async (contentType: ContentTypeData) => {
    await updateContentType(contentTypeKey, contentType);
    history.goBack();
  };

  useEffect(() => {
    fetchContentType(contentTypeKey).then(setContentType);
  }, [contentTypeKey]);

  if (error || !contentType) {
    return <ErrorContainer>Loading...</ErrorContainer>;
  }

  return (
    <Modal
      isOpen={contentTypeModalState.isModalOpen}
      onClose={handleClose}
      title="Create New Content Type"
      size={50}
    >
      <ContentTypeForm
        initialContentType={contentType}
        onUpdate={handleUpdate}
        parentUrl={match.url}
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
        locale={locale}
      />
    </Modal>
  );
};

export default ContentTypeEditModal;
