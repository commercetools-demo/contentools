import { useStateContentType } from '@commercetools-demo/contentools-state';
import { ContentTypeData } from '@commercetools-demo/contentools-types';
import {
  ConfirmationModal,
  Modal,
  useModalState,
} from '@commercetools-demo/contentools-ui-components';
import Text from '@commercetools-uikit/text';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import ContentTypeForm from '../content-type-form';

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
  const confirmationModalState = useModalState(false);
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
    <>
      <Modal
        isOpen={contentTypeModalState.isModalOpen}
        onClose={confirmationModalState.openModal}
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
      <ConfirmationModal
        isOpen={confirmationModalState.isModalOpen}
        onClose={confirmationModalState.closeModal}
        onConfirm={handleClose}
        onReject={confirmationModalState.closeModal}
        confirmTitle="Close"
        rejectTitle="Continue Editing"
      >
        <Text.Body>
          Are you sure you want to close the content type editor without saving
          the changes?
        </Text.Body>
      </ConfirmationModal>
    </>
  );
};

export default ContentTypeEditModal;
