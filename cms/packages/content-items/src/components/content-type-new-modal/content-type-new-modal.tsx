import {
  ContentTypeData,
  ContentTypeMetaData,
} from '@commercetools-demo/contentools-types';
import {
  Modal,
  useModalState,
} from '@commercetools-demo/contentools-ui-components';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useStateContentType } from '@commercetools-demo/contentools-state';
import styled from 'styled-components';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
`;

const ContentTypeNewModal: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch();
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
          <StyledCard
            key={contentType.key}
            onClick={() => handleSelect(contentType)}
          >
            <div>
              {contentType.metadata.icon ? (
                <span>{contentType.metadata.icon}</span>
              ) : (
                <i className="fas fa-file"></i>
              )}
            </div>
            <h3>{contentType.metadata.name}</h3>
          </StyledCard>
        ))}
      </StyledGrid>
    </Modal>
  );
};

export default ContentTypeNewModal;
