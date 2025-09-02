import React from 'react';
import { Modal } from '@commercetools-demo/contentools-ui-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { Page } from '@commercetools-demo/contentools-types';
import PropertyEditor from '@commercetools-demo/contentools-property-editor';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  page: Page | null;
  selectedContentItemKey: string | null;
  baseURL: string;
  businessUnitKey: string;
}

const ComponentEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  page,
  selectedContentItemKey,
  baseURL,
  businessUnitKey,
}) => {
  if (!selectedContentItemKey || !page) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Component"
        size={30}
      >
        <Text.Body>No component selected</Text.Body>
      </Modal>
    );
  }

  const selectedComponent = page.components.find(
    (c) => c.key === selectedContentItemKey
  );

  if (!selectedComponent) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Component"
        size={30}
      >
        <Text.Body>Component not found</Text.Body>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Component"
      size={30}
    >
      <Spacings.Stack scale="m">
        <PropertyEditor
          component={selectedComponent}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          onChange={() => {
            // Handle component change
          }}
          onComponentUpdated={() => {
            // Handle component update
          }}
        />
      </Spacings.Stack>
    </Modal>
  );
};

export default ComponentEditorModal;
