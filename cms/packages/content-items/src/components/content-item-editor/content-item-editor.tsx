import React, { useCallback, useEffect, useState } from 'react';
import {
  InfoModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import { ContentItem, ContentItemVersionInfo } from '@commercetools-demo/cms-types';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import ContentItemActions from './content-item-actions';
import VersionHistorySidebar from './version-history-sidebar';
import {
  useStateStateManagement,
  useStateVersion,
} from '@commercetools-demo/cms-state';

interface ContentItemEditorProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;
  isNew: boolean;
  locale?: string;
  baseURL?: string;
  businessUnitKey?: string;
  onSave?: (item: ContentItem) => void;
  onPublish?: (item: ContentItem) => void;
  onRevert?: (key: string) => void;
}

const ContentItemEditor: React.FC<ContentItemEditorProps> = ({
  isOpen,
  onClose,
  item,
  isNew,
  locale = 'en-US',
  baseURL = '',
  businessUnitKey = '',
  onSave,
  onPublish,
  onRevert,
}) => {
  const hydratedUrl = baseURL + '/' + businessUnitKey;
  const versionHistoryState = useModalState();
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [contentVersion, setContentVersion] = useState<ContentItemVersionInfo | null>(
    null
  );

  const { fetchVersions, versions } =
    useStateVersion<ContentItemVersionInfo>();
  const { currentState } = useStateStateManagement();

  const handleComponentUpdated = (updatedComponent: ContentItem) => {
    onSave?.(updatedComponent);
  };

  const handlePublish = () => {
    if (item?.key) {
      onPublish?.(item);
    }
  };

  const handleRevert = () => {
    if (item?.key) {
      onRevert?.(item.key);
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
    // versionHistoryState.closeModal();
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

  useEffect(() => {
    handleFetchVersions();
  }, [handleFetchVersions]);

  if (!item) {
    return null;
  }

  return (
    <>
      <InfoModalPage
        isOpen={isOpen}
        onClose={onClose}
        title={
          isNew ? 'Create Content Item' : `Edit ${item.name || 'Content Item'}`
        }
        topBarCurrentPathLabel={isNew ? 'Create' : 'Edit'}
        topBarPreviousPathLabel="Content Items"
      >
        <Spacings.Stack>
          {!isNew && (
            <ContentItemActions
              showVersionHistory={versionHistoryState.isModalOpen}
              onToggleVersionHistory={() =>
                versionHistoryState.isModalOpen
                  ? versionHistoryState.closeModal()
                  : versionHistoryState.openModal()
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
      </InfoModalPage>
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
