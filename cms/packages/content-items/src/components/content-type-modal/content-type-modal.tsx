import { ContentTypeMetaData } from '@commercetools-demo/cms-types';
import {
    InfoDialog,
} from '@commercetools-frontend/application-components';
import React from 'react';
import styles from './content-type-modal.module.css';

interface ContentTypeModalProps {
  contentTypesMetaData: ContentTypeMetaData[];
  onSelect: (contentTypeMetaData: ContentTypeMetaData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ContentTypeModal: React.FC<ContentTypeModalProps> = ({
  contentTypesMetaData,
  onSelect,
  isOpen,
  onClose,
}) => {
  const handleSelect = (contentTypeMetaData: ContentTypeMetaData) => {
    onSelect(contentTypeMetaData);
    onClose();
  };

  return (
      <InfoDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Select Content Type"
        size="l"
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
      </InfoDialog>
  );
};

export default ContentTypeModal;
