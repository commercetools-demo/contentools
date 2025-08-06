import { ContentTypeData, ContentTypeMetaData } from '@commercetools-demo/cms-types';
import { Modal, useModalState } from '@commercetools-demo/cms-ui-components';
import React from 'react';
import styles from './content-type-modal.module.css';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useStateContentType } from '@commercetools-demo/cms-state';

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
        size={80}
      >
        <div className={styles.contentTypeGrid}>
          {contentTypes.map((contentType) => (
            <div
              key={contentType.key}
              className={styles.contentTypeCard}
              onClick={() => handleSelect(contentType)}
            >
              <div className={styles.contentTypeIcon}>
                {contentType.metadata.icon ? (
                  <span>{contentType.metadata.icon}</span>
                ) : (
                  <i className="fas fa-file"></i>
                )}
              </div>
              <h3 className={styles.contentTypeName}>{contentType.metadata.name}</h3>
            </div>
          ))}
        </div>
      </Modal>
  );
};

export default ContentTypeNewModal;
