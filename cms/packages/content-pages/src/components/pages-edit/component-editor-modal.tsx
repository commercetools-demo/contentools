import React, { useEffect } from 'react';
import { Modal } from '@commercetools-demo/contentools-ui-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  ContentItem,
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

const getStampTone = (currentState: EStateType | null) => {
  switch (currentState) {
    case EStateType.DRAFT:
      return 'information';
    case EStateType.PUBLISHED:
      return 'positive';
    case EStateType.BOTH:
      return 'warning';
    default:
      return 'information';
  }
};
const StyledStamp = styled.span`
  text-transform: capitalize;
`;

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

  const { fetchStates } = useStateStateManagement()!;
  const {
    currentState: currentStatePageItem,
    fetchStates: fetchPageItemStates,
    publish: publishPageContentItem,
    revertToPublished: revertToPublishedPageContentItem,
  } = useStateStateManagement(CONETNT_ITEMS_IN_PAGE_SCOPE)!;
  const { fetchVersions } = useStateVersion<PageVersionInfo>()!;

  const selectedComponent = currentPage?.components?.find(
    (c: ContentItem) => c?.key === selectedContentItemKey
  );

  const handleComponentUpdated = async (component: ContentItem) => {
    if (!currentPage || !selectedContentItemKey) return;
    await updateComponentInCurrentPage(
      hydratedUrl,
      selectedContentItemKey,
      component
    );
    fetchStates(hydratedUrl, currentPage.key, 'pages');
    fetchVersions(hydratedUrl, currentPage.key, 'pages');
    onClose();
  };

  const onRevert = async () => {
    if (currentPage?.key && selectedComponent) {
      await revertToPublishedPageContentItem(hydratedUrl, selectedComponent.key, 'page-items');
    }
  };
  const onPublish = async () => {
    if (currentPage?.key && selectedComponent) {
      await publishPageContentItem(hydratedUrl, selectedComponent, selectedComponent.key, 'page-items', true);
    }
  };

  useEffect(() => {
    if (selectedContentItemKey) {
      fetchPageItemStates(hydratedUrl, selectedContentItemKey, 'page-items');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Component" size={30}>
      <Spacings.Stack scale="m">
        <Spacings.Inline alignItems="center" justifyContent="space-between">
          {currentStatePageItem && (
            <Stamp tone={getStampTone(currentStatePageItem)}>
              <StyledStamp>{currentStatePageItem}</StyledStamp>
            </Stamp>
          )}
          <Spacings.Inline alignItems="center" justifyContent="flex-end">
            <Spacings.Inline>
              {(currentStatePageItem === EStateType.DRAFT ||
                currentStatePageItem === EStateType.BOTH) && (
                <SecondaryButton
                  size="10"
                  label="Revert to Published"
                  onClick={onRevert}
                />
              )}

              {currentStatePageItem !== EStateType.PUBLISHED && (
                <PrimaryButton size="10" label="Publish" onClick={onPublish} />
              )}
            </Spacings.Inline>
          </Spacings.Inline>
        </Spacings.Inline>
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
