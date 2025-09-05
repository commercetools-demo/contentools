import React from 'react';
import { Modal } from '@commercetools-demo/contentools-ui-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  ContentItem,
  Page,
  PageVersionInfo,
} from '@commercetools-demo/contentools-types';
import PropertyEditor from '@commercetools-demo/contentools-property-editor';
import {
  useStatePages,
  useStateStateManagement,
  useStateVersion,
} from '@commercetools-demo/contentools-state';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedContentItemKey: string | null;
  baseURL: string;
  businessUnitKey: string;
}

const ComponentEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedContentItemKey,
  baseURL,
  businessUnitKey,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const {
    removeComponentFromCurrentPage,
    updateComponentInCurrentPage,
    currentPage,
  } = useStatePages()!;
  const { fetchStates} = useStateStateManagement()!;
  const { fetchVersions } = useStateVersion<PageVersionInfo>()!;

  const selectedComponent = currentPage?.components?.find(
    (c: ContentItem) => c?.key === selectedContentItemKey
  );

  const handleComponentUpdated = async (component: ContentItem) => {
    if (!currentPage || !selectedContentItemKey) return;
    await updateComponentInCurrentPage(hydratedUrl, selectedContentItemKey, component);
    fetchStates(hydratedUrl, currentPage.key, 'pages');
    fetchVersions(hydratedUrl, currentPage.key, 'pages');
    onClose();
  };

  if (!selectedContentItemKey || !currentPage) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Component" size={30}>
        <Text.Body>No component selected</Text.Body>
      </Modal>
    );
  }

  if (!selectedComponent) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Component" size={30}>
        <Text.Body>Component not found</Text.Body>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Component" size={30}>
      <Spacings.Stack scale="m">
        <PropertyEditor
          component={selectedComponent}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          showDeleteButton={true}
          onChange={(component) => {}}
          onComponentUpdated={(component) => {
            handleComponentUpdated(component);
          }}
          onComponentDeleted={(componentId) => {
            removeComponentFromCurrentPage(hydratedUrl, selectedContentItemKey);
          }}
        />
      </Spacings.Stack>
    </Modal>
  );
};

export default ComponentEditorModal;
