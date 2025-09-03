import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  useStatePages,
  useStateEditor,
  useStateStateManagement,
  useStateVersion,
} from '@commercetools-demo/contentools-state';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import IconButton from '@commercetools-uikit/icon-button';
import Card from '@commercetools-uikit/card';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useModalState } from '@commercetools-demo/contentools-ui-components';
import { GridIcon, GearIcon, BackIcon } from '@commercetools-uikit/icons';
import styled from 'styled-components';
import ComponentLibraryModal from './component-library-modal';
import PageSettingsModal from './page-settings-modal';
import ComponentEditorModal from './component-editor-modal';
import PagesGridLayout from './pages-grid-layout';
import { PageVersionInfo } from '@commercetools-demo/contentools-types';
import VersionHistorySidebar from '@commercetools-demo/contentools-version-history';
import PageGridActions from './page-grid-actions';

interface Props {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}

interface RouteParams {
  pageKey: string;
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  z-index: 100;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #007acc;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ContainerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
`;

const ContainerHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Breadcrumb = styled.span`
  color: #666;
  font-size: 14px;
  &:after {
    content: ' › ';
    margin: 0 4px;
  }
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
  background: #f8f9fa;
`;

const SaveBar = styled.div<{ visible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #333;
  color: white;
  padding: 16px 24px;
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const SaveBarActions = styled.div`
  display: flex;
  gap: 12px;
`;

const PagesEdit: React.FC<Props> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale,
}) => {
  const history = useHistory();
  const { pageKey } = useParams<RouteParams>();
  const {
    currentPage,
    loading,
    error,
    fetchPage,
    updatePage,
    deletePage,
    addComponentToCurrentPage,
    // clearUnsavedChanges,
  } = useStatePages()!;

  const editorState = useStateEditor();

  const { fetchStates, publish, revertToPublished, currentState } =
    useStateStateManagement()!;
  const { fetchVersions, versions } = useStateVersion<PageVersionInfo>()!;
  const draggingComponentType = editorState?.draggingComponentType;

  const versionHistoryState = useModalState();

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [contentVersion, setContentVersion] = useState<PageVersionInfo | null>(
    null
  );
  const [selectedContentItemKey, setSelectedContentItemKey] = useState<
    string | null
  >(null);

  // Modal states
  const componentLibraryModal = useModalState();
  const pageSettingsModal = useModalState();
  const componentEditorModal = useModalState();

  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  const handleDeletePage = async (key: string) => {
    await deletePage(hydratedUrl, key);
  };

  const handleBack = () => {
    history.push(`/`);
  };

  const handleComponentSelect = (contentItemKey: string | null) => {
    setSelectedContentItemKey(contentItemKey);
    if (contentItemKey) {
      componentEditorModal.openModal();
    }
  };

  const handleOpenComponentLibrary = () => {
    componentLibraryModal.openModal();
  };

  const handleOpenPageSettings = () => {
    setSelectedContentItemKey(null);
    pageSettingsModal.openModal();
  };

  const handleCloseComponentEditor = () => {
    componentEditorModal.closeModal();
    setSelectedContentItemKey(null);
  };

  const handleComponentToCurrentPage = async (
    rowId: string,
    cellId: string
  ) => {
    await addComponentToCurrentPage(
      hydratedUrl,
      draggingComponentType,
      rowId,
      cellId
    );
    handleFetchStatesAndVersions();
  };

  const handleFetchStatesAndVersions = useCallback(() => {
    if (pageKey) {
      fetchStates(hydratedUrl, pageKey, 'pages');
      fetchVersions(hydratedUrl, pageKey, 'pages');
    }
  }, [pageKey, fetchStates, hydratedUrl]);

  const handleCloseVersionHistory = () => {
    versionHistoryState.closeModal();
  };

  const handleOpenVersionHistory = () => {
    versionHistoryState.openModal();
  };

  const handleJson = (isPreview: boolean = false) => {
    window.open(
      `${baseURL}/${businessUnitKey}/${
        isPreview ? 'preview/' : 'published/'
      }pages/${pageKey}`,
      '_blank'
    );
  };

  const handleRevert = async () => {
    if (currentPage?.key) {
      await revertToPublished(hydratedUrl, currentPage.key, 'pages').then(
        () => {
          fetchPage(hydratedUrl, pageKey).then(() => {
            handleFetchStatesAndVersions();
          });
        }
      );
      setContentVersion(null);
      setSelectedVersionId(null);
    }
  };

  const handlePublish = async () => {
    if (currentPage?.key) {
      await publish(hydratedUrl, currentPage, currentPage.key, 'pages', true);
      fetchPage(hydratedUrl, pageKey);
    }
  };

  const handleVersionSelected = (versionId: string) => {
    setSelectedVersionId(versionId);
    const selectedVersion = versions.find((v) => v.id === versionId);
    if (selectedVersion) {
      setContentVersion(selectedVersion);
    }
  };

  const handleApplyVersion = async (versionId: string) => {
    const selectedVersion = versions.find((v) => v.id === versionId);
    if (selectedVersion && currentPage?.key) {
      // await updatePage(hydratedUrl,  selectedVersion);
      setSelectedVersionId(null);
      setContentVersion(null);
    }
  };

  const handleSelectionCancelled = () => {
    setSelectedVersionId(null);
    setContentVersion(null);
    handleCloseVersionHistory();
  };

  useEffect(() => {
    if (pageKey) {
      fetchPage(hydratedUrl, pageKey).then(() => {
        handleFetchStatesAndVersions();
      });
    }
  }, [pageKey, fetchPage, parentUrl]);

  if (loading) {
    return (
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (error || !currentPage) {
    return (
      <Container>
        <div style={{ padding: '20px' }}>
          <Card>
            <Spacings.Stack scale="m">
              <Text.Headline as="h2">Page Not Found</Text.Headline>
              <Text.Body tone="critical">
                {error || 'The requested page could not be found.'}
              </Text.Body>
              <SecondaryButton label="Back to Pages" onClick={handleBack} />
            </Spacings.Stack>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <MainContent>
        <ContainerHeader>
          <IconButton
            icon={<BackIcon />}
            label="Back to Pages"
            onClick={handleBack}
            size="medium"
          />
          <ContainerHeaderContent>
            <Breadcrumb>Pages</Breadcrumb>
            <Text.Subheadline as="h4">{currentPage.name}</Text.Subheadline>
          </ContainerHeaderContent>
        </ContainerHeader>

        <EditorContent>
          <PageGridActions
            showVersionHistory={versionHistoryState.isModalOpen}
            onToggleVersionHistory={() =>
              versionHistoryState.isModalOpen
                ? handleCloseVersionHistory()
                : handleOpenVersionHistory()
            }
            onTogglePageSettings={handleOpenPageSettings}
            onTogglePageLibrary={handleOpenComponentLibrary}
            currentState={currentState}
            onViewJson={handleJson}
            onRevert={handleRevert}
            onPublish={handlePublish}
          />
          <PagesGridLayout
            page={currentPage}
            selectedContentItemKey={selectedContentItemKey}
            onComponentSelect={handleComponentSelect}
            onComponentToCurrentPage={handleComponentToCurrentPage}
          />
        </EditorContent>
      </MainContent>

      {/* Modal Components */}
      <ComponentLibraryModal
        isOpen={componentLibraryModal.isModalOpen}
        onClose={componentLibraryModal.closeModal}
      />

      <PageSettingsModal
        isOpen={pageSettingsModal.isModalOpen}
        onClose={pageSettingsModal.closeModal}
        currentPage={currentPage}
        deletePage={handleDeletePage}
        parentUrl={parentUrl}
      />

      <ComponentEditorModal
        isOpen={componentEditorModal.isModalOpen}
        onClose={handleCloseComponentEditor}
        page={currentPage}
        selectedContentItemKey={selectedContentItemKey}
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
      />

      <VersionHistorySidebar
        isVisible={versionHistoryState.isModalOpen}
        selectedVersionId={selectedVersionId}
        onVersionSelected={handleVersionSelected}
        onApplyVersion={handleApplyVersion}
        onSelectionCancelled={handleSelectionCancelled}
        onClose={handleCloseVersionHistory}
      />
    </Container>
  );
};

export default PagesEdit;
