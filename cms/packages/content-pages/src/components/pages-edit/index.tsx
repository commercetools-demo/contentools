import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useStatePages, useStateEditor } from '@commercetools-demo/contentools-state';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import IconButton from '@commercetools-uikit/icon-button';
import Card from '@commercetools-uikit/card';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useModalState } from '@commercetools-demo/contentools-ui-components';
import { GridIcon, GearIcon } from '@commercetools-uikit/icons';
import styled from 'styled-components';
import ComponentLibraryModal from './component-library-modal';
import PageSettingsModal from './page-settings-modal';
import ComponentEditorModal from './component-editor-modal';
import PagesGridLayout from './pages-grid-layout';

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
    unsavedChanges,
    fetchPage,
    updatePage,
    deletePage,
    clearUnsavedChanges,
  } = useStatePages()!;

  const editorState = useStateEditor();
  const draggingComponentType = editorState?.draggingComponentType;

  const [selectedContentItemKey, setSelectedContentItemKey] = useState<string | null>(
    null
  );

  // Modal states
  const componentLibraryModal = useModalState();
  const pageSettingsModal = useModalState();
  const componentEditorModal = useModalState();

  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  const handleDeletePage = async (key: string) => {
    await deletePage(hydratedUrl, key);
  };

  useEffect(() => {
    if (pageKey) {
      fetchPage(hydratedUrl, pageKey);
    }
  }, [pageKey, fetchPage, history, parentUrl]);

  const handleBack = () => {
    if (unsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
    }
    history.push(`/${parentUrl}`);
  };

  const handleSave = async () => {
    if (currentPage) {
      try {
        await updatePage(hydratedUrl, currentPage);
        clearUnsavedChanges();
      } catch (error) {
        console.error('Failed to save page:', error);
        // Handle error - could show a toast
      }
    }
  };

  const handleDiscard = () => {
    if (pageKey) {
      fetchPage(hydratedUrl, pageKey); // Refetch to reset changes
      clearUnsavedChanges();
    }
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
        <Header>
          <HeaderLeft>
            <BackButton onClick={handleBack}>← Back to Pages</BackButton>
            <div>
              <Text.Subheadline>{currentPage.name}</Text.Subheadline>
              <Text.Detail tone="secondary">
                Route: {currentPage.route}
              </Text.Detail>
            </div>
          </HeaderLeft>

          <HeaderRight>
            <SecondaryButton
              label="Components"
              iconLeft={<GridIcon />}
              onClick={handleOpenComponentLibrary}
            />
            <IconButton
              icon={<GearIcon />}
              label="Page Settings"
              onClick={handleOpenPageSettings}
            />
          </HeaderRight>
        </Header>

        <EditorContent>
          <PagesGridLayout
            page={currentPage}
            selectedContentItemKey={selectedContentItemKey}
            onComponentSelect={handleComponentSelect}
            baseURL={baseURL}
            businessUnitKey={businessUnitKey}
            locale={locale}
            activeComponentType={draggingComponentType}
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

      <SaveBar visible={unsavedChanges}>
        <Text.Body>You have unsaved changes</Text.Body>
        <SaveBarActions>
          <SecondaryButton label="Discard" onClick={handleDiscard} />
          <PrimaryButton label="Save Changes" onClick={handleSave} />
        </SaveBarActions>
      </SaveBar>
    </Container>
  );
};

export default PagesEdit;
