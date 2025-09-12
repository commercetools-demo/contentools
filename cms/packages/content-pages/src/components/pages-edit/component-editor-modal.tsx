import React, { useEffect, useState } from 'react';
import {
  getStateType,
  Modal,
  StateTag,

  ConfirmationModal,
  useModalState} from '@commercetools-demo/contentools-ui-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  ContentItem,
  EContentType,
  EStateType,
  Page,
  PageVersionInfo,
} from '@commercetools-demo/contentools-types';
import PropertyEditor from '@commercetools-demo/contentools-property-editor';
import {
  useStatePages,
  useStateStateManagement,
  useStateVersion,
} from '@commercetools-demo/contentools-state';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Stamp from '@commercetools-uikit/stamp';
import styled from 'styled-components';
import { CONETNT_ITEMS_IN_PAGE_SCOPE } from '../../constants';
import isEqual from 'fast-deep-equal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  selectedContentItemKey: string | null;
  baseURL: string;
  businessUnitKey: string;
}

const ComponentEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRefresh,
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

  const {
    currentState: currentStatePageItem,
    fetchStates: fetchPageItemStates,
    publish: publishPageContentItem,
    revertToPublished: revertToPublishedPageContentItem,
  } = useStateStateManagement(CONETNT_ITEMS_IN_PAGE_SCOPE)!;

  const pageItemStateType = getStateType(currentStatePageItem);

  const confirmationModalState = useModalState();

  const selectedComponent = currentPage?.components?.find(
    (c: ContentItem) => c?.key === selectedContentItemKey
  );
  const [changedContentItem, setChangedContentItem] = useState<
    ContentItem | undefined
  >(selectedComponent);

  const handleComponentUpdated = async (component: ContentItem) => {
    if (!currentPage || !selectedContentItemKey) return;
    await updateComponentInCurrentPage(
      hydratedUrl,
      selectedContentItemKey,
      component
    );

    onClose();
  };

  const onRevert = async () => {
    if (currentPage?.key && selectedComponent) {
      await revertToPublishedPageContentItem(
        hydratedUrl,
        selectedComponent.key,
        EContentType.PAGE_ITEMS
      );
    }
    onRefresh();
  };
  const onPublish = async () => {
    if (currentPage?.key && selectedComponent) {
      await publishPageContentItem(
        hydratedUrl,
        selectedComponent,
        selectedComponent.key,
        EContentType.PAGE_ITEMS,
        true
      );
    }
    onRefresh();
  };

  const handleCloseCheck = () => {
    if (changedContentItem && !isEqual(changedContentItem, selectedComponent)) {
      confirmationModalState.openModal();
      return;
    }
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setChangedContentItem(undefined);
  };

  useEffect(() => {
    if (selectedContentItemKey) {
      fetchPageItemStates(
        hydratedUrl,
        selectedContentItemKey,
        EContentType.PAGE_ITEMS
      );
    }
  }, [selectedContentItemKey, fetchPageItemStates]);

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
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseCheck}
        title="Edit Component"
        size={30}
      >
        <Spacings.Stack scale="m">
          <Spacings.Inline alignItems="center" justifyContent="space-between">
            {currentStatePageItem && <StateTag status={currentStatePageItem} />}
            <Spacings.Inline alignItems="center" justifyContent="flex-end">
              <Spacings.Inline>
                {(pageItemStateType === EStateType.DRAFT ||
                  pageItemStateType === EStateType.BOTH) && (
                  <SecondaryButton
                    size="10"
                    label="Revert to Published"
                    onClick={onRevert}
                  />
                )}

                {pageItemStateType !== EStateType.PUBLISHED && (
                  <PrimaryButton
                    size="10"
                    label="Publish"
                    onClick={onPublish}
                  />
                )}
              </Spacings.Inline>
            </Spacings.Inline>
          </Spacings.Inline>
          <PropertyEditor
            component={selectedComponent}
            baseURL={baseURL}
            businessUnitKey={businessUnitKey}
            showDeleteButton={true}
            onChange={setChangedContentItem}
            onComponentUpdated={(component) => {
              handleComponentUpdated(component);
            }}
            onComponentDeleted={(_componentId) => {
              removeComponentFromCurrentPage(
                hydratedUrl,
                selectedContentItemKey
              );
            }}
          />
        </Spacings.Stack>
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
          Are you sure you want to close the component editor without saving the
          changes?
        </Text.Body>
      </ConfirmationModal>
    </>
  );
};

export default ComponentEditorModal;
