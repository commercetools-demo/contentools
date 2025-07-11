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

interface ContentItemEditorProps {
  locale?: string;
  baseURL?: string;
  businessUnitKey?: string;
}

const ContentItemEditor: React.FC<ContentItemEditorProps> = ({
  locale = 'en-US',
  baseURL = '',
  businessUnitKey = '',
}) => {
  const history = useHistory();
  const { contentItemKey } = useParams<{ contentItemKey: string }>();
  const isNew = !contentItemKey;
  const hydratedUrl = baseURL + '/' + businessUnitKey;
  const versionHistoryState = useModalState();
  const contentItemEditorState = useModalState(true);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [contentVersion, setContentVersion] =
    useState<ContentItemVersionInfo | null>(null);
  const [item, setItem] = useState<ContentItem | null>(null);
  const { fetchVersions, saveVersion, versions } = useStateVersion<ContentItemVersionInfo>();
  const { currentState } = useStateStateManagement();
  const { fetchStates, saveDraft, publish, revertToPublished } =
    useStateStateManagement();
  const {
    fetchContentItem,
    items,
    loading,
    error,
    states,
    fetchContentItems,
    clearError,
    updateContentItem,
    deleteContentItem,
  } = useStateContentItem();

  const handleSaveVersion = async () => {
    if (item) {
      return saveVersion(
        hydratedUrl,
        item,
        item.key,
        'content-items'
      );
    }
  };

  const handleFetchStates = async (key: string, contentType: string) => {
    if (key && contentType) {
      await fetchStates(
        hydratedUrl,
        key,
        contentType as 'content-items' | 'pages'
      );
    }
  };

  const handleSaveDraft = (updatedItem: ContentItem) => {
    if (item) {
      return saveDraft(
        hydratedUrl,
        updatedItem,
        item.key,
        'content-items'
      );
    }
  };

  const onSave = async (currentItem: ContentItem) => {
    clearError();
    if (currentItem) {
      const component = {
        ...item,
        ...currentItem,
      };

      if (component) {
        // if (view === 'new') {
        //   const newItem = {
        //     ...component,
        //     key: `item-${uuidv4()}`,
        //   };
        //   setSelectedItem(newItem);
        //   dispatch(
        //     createContentItem({
        //       baseURL: hydratedUrl,
        //       businessUnitKey,
        //       item: newItem,
        //     })
        //   );
        //   setView('list');
        // } else {
        await updateContentItem(hydratedUrl, component.key, component);
        // }

        await handleSaveVersion();
        await handleSaveDraft(component);

        // After updating, refresh versions and states
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
    const { item, key, contentType, clearDraft = false } = params;
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
      onPublish?.({item, key: item.key, contentType: 'content-items'});
    }
  };

  const onRevert = async (params: { key: string; contentType: string }) => {
    const { key, contentType } = params;
    if (key && contentType) {
      await revertToPublished(
        hydratedUrl,
        key,
        contentType as 'content-items' | 'pages'
      );
    }
  };

  const handleRevert = () => {
    if (item?.key) {
      onRevert?.({key: item.key, contentType: 'content-items'});
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
    if (!isNew) {
      fetchContentItem(hydratedUrl, contentItemKey).then((item) => {
        setItem(item);
      });
    }
  }, [fetchContentItem, hydratedUrl, contentItemKey]);

  if (!item || loading) {
    return null;
  }

  return (
    <>
      <Modal
        isOpen={contentItemEditorState.isModalOpen}
        size={80}
        onClose={handleClose}
        title={
          isNew ? 'Create Content Item' : `Edit ${item.name || 'Content Item'}`
        }
        topBarPreviousPathLabel="Content Items"
      >
        <Spacings.Stack>
          {!isNew && (
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
          )}

          <div
            className={`content-item-body ${
              versionHistoryState.isModalOpen ? 'with-sidebar' : ''
            }`}
          >
            <div className="content-item-edit">
              <div className="content-item-edit-editor">
                <Spacings.Stack scale="m">
                  <Text.Subheadline as="h4">Edit Content Item</Text.Subheadline>
                  <Text.Body>Content item: {item.name || item.key}</Text.Body>
                  <Text.Detail>
                    This is a placeholder for the property editor component.
                    You'll need to implement the actual editing interface based
                    on your content type schemas.
                  </Text.Detail>
                </Spacings.Stack>
              </div>

              {!isNew && (
                <div className="content-item-edit-preview">
                  <Spacings.Stack scale="m">
                    <Text.Subheadline as="h4">Content Preview</Text.Subheadline>
                    <Text.Body>Previewing content item: {item.key}</Text.Body>
                    <Text.Detail>Locale: {locale}</Text.Detail>
                    <Text.Detail>
                      This is a placeholder for the content preview component.
                      You'll need to implement the actual preview rendering
                      based on your content types.
                    </Text.Detail>
                  </Spacings.Stack>
                </div>
              )}
            </div>
          </div>
        </Spacings.Stack>
      </Modal>
      <VersionHistorySidebar
        isVisible={versionHistoryState.isModalOpen}
        selectedVersionId={selectedVersionId}
        onVersionSelected={handleVersionSelected}
        onApplyVersion={handleApplyVersion}
        onSelectionCancelled={handleSelectionCancelled}
      />
    </>
  );
};

export default ContentItemEditor;
