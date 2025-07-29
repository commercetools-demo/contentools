import React, { useCallback, useEffect, useState } from 'react';
import { Modal, useModalState } from '@commercetools-demo/cms-ui-components';
import {
  ContentItem,
  ContentItemVersionInfo,
} from '@commercetools-demo/cms-types';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import ContentItemActions from './content-item-actions';
import VersionHistorySidebar from './version-history-sidebar';
import {
  useStateStateManagement,
  useStateVersion,
  useStateContentItem,
} from '@commercetools-demo/cms-state';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PropertyEditor from '@commercetools-demo/cms-property-editor';
import ContentItemPreview from '../content-item-preview';

const StyledRowDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledColumnDiv = styled.div`
  width: 50%;
`;

interface ContentItemEditorEditFormProps {
  locale?: string;
  baseURL?: string;
  businessUnitKey?: string;
}

const ContentItemEditorEditForm: React.FC<ContentItemEditorEditFormProps> = ({
  locale = 'en-US',
  baseURL = '',
  businessUnitKey = '',
}) => {
  const history = useHistory();
  const { contentItemKey } = useParams<{
    contentItemKey?: string;
  }>();
  const hydratedUrl = baseURL + '/' + businessUnitKey;
  const versionHistoryState = useModalState();
  const contentItemEditorState = useModalState(true);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [contentVersion, setContentVersion] =
    useState<ContentItemVersionInfo | null>(null);
  const [item, setItem] = useState<ContentItem | null>(null);
  const { fetchVersions, versions } = useStateVersion<ContentItemVersionInfo>();
  const { currentState } = useStateStateManagement();
  const { fetchStates, publish, revertToPublished } = useStateStateManagement();
  const {
    fetchContentItem,
    loading,
    fetchContentItems,
    clearError,
    updateContentItem,
  } = useStateContentItem();

  const onSave = async (currentItem: ContentItem) => {
    clearError();
    if (currentItem) {
      const component = {
        ...item,
        ...currentItem,
      };

      if (component) {
        await updateContentItem(hydratedUrl, component.key, component).then(
          (item) => {
            setItem(item);
          }
        );

        await fetchVersions(hydratedUrl, component.key, 'content-items');
        await fetchStates(hydratedUrl, component.key, 'content-items');
        await fetchContentItems(hydratedUrl);
      }
    } else {
      console.error('No item to save');
    }
  };

  const onPublish = async (params: {
    item: ContentItem;
    key: string;
    contentType: string;
    clearDraft?: boolean;
  }) => {
    const { item, key, contentType, clearDraft = true } = params;
    if (item && key && contentType) {
      await publish(
        hydratedUrl,
        item,
        key,
        contentType as 'content-items' | 'pages',
        clearDraft
      );
    }
  };

  const handleComponentUpdated = (updatedComponent: ContentItem) => {
    onSave?.(updatedComponent);
  };

  const handlePublish = () => {
    if (item?.key) {
      onPublish?.({ item, key: item.key, contentType: 'content-items' });
      fetchContentItems(hydratedUrl);
    }
  };

  const onRevert = async (params: { key: string; contentType: string }) => {
    const { key, contentType } = params;
    if (key && contentType) {
      await revertToPublished(
        hydratedUrl,
        key,
        contentType as 'content-items' | 'pages'
      ).then(() => {
        fetchContentItem(hydratedUrl, key).then((item) => {
          setItem(item);
        });
      });
    }
  };

  const handleRevert = () => {
    if (item?.key) {
      onRevert?.({ key: item.key, contentType: 'content-items' });
      setContentVersion(null);
      setSelectedVersionId(null);
    }
  };

  const handleVersionSelected = (versionId: string) => {
    setSelectedVersionId(versionId);
    const selectedVersion = versions.find((v) => v.id === versionId);
    if (selectedVersion) {
      setContentVersion(selectedVersion);
    }
  };

  const handleApplyVersion = (versionId: string) => {
    const selectedVersion = versions.find((v) => v.id === versionId);
    if (selectedVersion && item?.key) {
      onSave?.(selectedVersion);
      setSelectedVersionId(null);
      setContentVersion(null);
    }
  };

  const handleSelectionCancelled = () => {
    setSelectedVersionId(null);
    setContentVersion(null);
    handleCloseVersionHistory();
  };

  const handleJson = (isPreview: boolean = false) => {
    window.open(
      `${baseURL}/${businessUnitKey}/${
        isPreview ? 'preview/' : 'published/'
      }content-items/${item?.key}`,
      '_blank'
    );
  };

  const handleFetchVersions = useCallback(async () => {
    if (item?.key) {
      const fetchedVersions = await fetchVersions(
        hydratedUrl,
        item.key,
        'content-items'
      );
    }
  }, [fetchVersions, item, hydratedUrl]);

  const handleClose = () => {
    contentItemEditorState.closeModal();
    history.goBack();
  };

  const handleCloseVersionHistory = () => {
    versionHistoryState.closeModal();
  };

  const handleOpenVersionHistory = () => {
    versionHistoryState.openModal();
  };

  useEffect(() => {
    handleFetchVersions();
  }, [handleFetchVersions, item]);

  useEffect(() => {
    if (contentItemKey) {
      fetchContentItem(hydratedUrl, contentItemKey).then((item) => {
        setItem(item);
      });
    }
  }, [fetchContentItem, hydratedUrl, contentItemKey]);

  if (!item || loading || !contentItemKey) {
    return null;
  }

  return (
    <>
      <Modal
        isOpen={contentItemEditorState.isModalOpen}
        size={80}
        onClose={handleClose}
        title={`Edit ${item.name || 'Content Item'}`}
        topBarPreviousPathLabel="Content Items"
      >
        <Spacings.Stack>
          <ContentItemActions
            showVersionHistory={versionHistoryState.isModalOpen}
            onToggleVersionHistory={() =>
              versionHistoryState.isModalOpen
                ? handleCloseVersionHistory()
                : handleOpenVersionHistory()
            }
            currentState={currentState}
            onViewJson={handleJson}
            onRevert={handleRevert}
            onPublish={handlePublish}
          />

          <div
            className={`content-item-body ${
              versionHistoryState.isModalOpen ? 'with-sidebar' : ''
            }`}
          >
            <StyledRowDiv>
              <StyledColumnDiv>
                <div className="content-item-edit-editor">
                  <PropertyEditor
                    component={item}
                    baseURL={baseURL}
                    businessUnitKey={businessUnitKey}
                    onComponentUpdated={handleComponentUpdated}
                    onComponentDeleted={() => {}}
                    versionedContent={selectedVersionId ? contentVersion : null}
                  />
                </div>
              </StyledColumnDiv>

              <StyledColumnDiv>
                <ContentItemPreview
                  item={item}
                  baseURL={baseURL}
                  businessUnitKey={businessUnitKey}
                  locale={locale}
                />
              </StyledColumnDiv>
            </StyledRowDiv>
          </div>
        </Spacings.Stack>
      </Modal>
      <VersionHistorySidebar
        isVisible={versionHistoryState.isModalOpen}
        selectedVersionId={selectedVersionId}
        onVersionSelected={handleVersionSelected}
        onApplyVersion={handleApplyVersion}
        onSelectionCancelled={handleSelectionCancelled}
        onClose={handleCloseVersionHistory}
      />
    </>
  );
};

export default ContentItemEditorEditForm;
