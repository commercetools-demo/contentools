import { useStateContentType } from '@commercetools-demo/contentools-state';
import { ContentTypeData } from '@commercetools-demo/contentools-types';
import {
  ContentTypeCard,
  Modal,
  useModalState,
} from '@commercetools-demo/contentools-ui-components';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const ContentTypeNewModal: React.FC = () => {
  const history = useHistory();
  const contentTypeModalState = useModalState(true);
  const { contentTypes } = useStateContentType();

  const handleClose = () => {
    contentTypeModalState.closeModal();
    history.goBack();
  };

  const handleSelect = (contentType: ContentTypeData) => {
    history.push(`new-content-item/${contentType.key}`);
  };

  return (
    <Modal
      isOpen={contentTypeModalState.isModalOpen}
      onClose={handleClose}
      title="Select Content Type"
      size={30}
    >
      <StyledGrid>
        {contentTypes.map((contentType) => (
          <ContentTypeCard
            key={contentType.id}
            contentType={contentType}
            onClick={() => handleSelect(contentType)}
          />
        ))}
      </StyledGrid>
    </Modal>
  );
};

export default ContentTypeNewModal;
