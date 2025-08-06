import {
  ContentTypeData,
  ContentTypeMetaData,
} from '@commercetools-demo/cms-types';
import { Modal, useModalState } from '@commercetools-demo/cms-ui-components';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useStateContentType } from '@commercetools-demo/cms-state';
import ContentTypeForm from '../content-type-form';

const ContentTypeNewModal: React.FC<{
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}> = ({ parentUrl, baseURL, businessUnitKey, locale }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const contentTypeModalState = useModalState(true);
  const { addContentType } = useStateContentType();
  const handleClose = () => {
    contentTypeModalState.closeModal();
    history.goBack();
  };

  const handleCreate = async (contentType: ContentTypeData) => {
    const contentTypeData = await addContentType(contentType);
    history.replace(`/content-type/${contentTypeData.key}`);
  };

  return (
    <Modal
      isOpen={contentTypeModalState.isModalOpen}
      onClose={handleClose}
      title="Create New Content Type"
      size={50}
    >
      <ContentTypeForm
        onCreate={handleCreate}
        onCancel={handleClose}
        parentUrl={match.url}
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
        locale={locale}
      />
    </Modal>
  );
};

export default ContentTypeNewModal;
