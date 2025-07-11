import { ContentTypeMetaData } from '@commercetools-demo/cms-types';
import { Modal, useModalState } from '@commercetools-demo/cms-ui-components';
import React from 'react';
import styles from './content-type-modal.module.css';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useStateContentType } from '@commercetools-demo/cms-state';

const ContentTypeNewModal: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const contentTypeModalState = useModalState(true);
  const { contentTypesMetaData } = useStateContentType();
  const handleClose = () => {
    contentTypeModalState.closeModal();
    history.goBack();
  };

  const handleSelect = (contentTypeMetaData: ContentTypeMetaData) => {
    history.push(`${match.path}/new-content-item/${contentTypeMetaData.type}`);
  };

  return (
      <Modal
        isOpen={contentTypeModalState.isModalOpen}
        onClose={handleClose}
        title="Select Content Type"
        size={80}
      >
        <div className={styles.contentTypeGrid}>
          {contentTypesMetaData.map((metadata) => (
            <div
              key={metadata.type}
              className={styles.contentTypeCard}
              onClick={() => handleSelect(metadata)}
            >
              <div className={styles.contentTypeIcon}>
                {metadata.icon ? (
                  <span>{metadata.icon}</span>
                ) : (
                  <i className="fas fa-file"></i>
                )}
              </div>
              <h3 className={styles.contentTypeName}>{metadata.name}</h3>
            </div>
          ))}
        </div>
      </Modal>
  );
};

export default ContentTypeNewModal;
