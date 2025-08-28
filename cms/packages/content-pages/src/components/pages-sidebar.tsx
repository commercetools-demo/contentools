import React from 'react';
import { Modal } from '@commercetools-demo/contentools-ui-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { Page } from '@commercetools-demo/contentools-types';
import PropertyEditor from '@commercetools-demo/contentools-property-editor';
import styled from 'styled-components';

interface Props {
  isOpen: boolean;
  view: 'component-library' | 'page-settings' | 'component-editor';
  page: Page | null;
  selectedComponentId: string | null;
  onClose: () => void;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: white;
  border-left: 1px solid #e0e0e0;
  transform: translateX(${(props) => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const ComponentLibraryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const ComponentItem = styled.div`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  transition: all 0.2s;

  &:hover {
    border-color: #007acc;
    background: #f0f8ff;
  }
`;

const PagesSidebar: React.FC<Props> = ({
  isOpen,
  view,
  page,
  selectedComponentId,
  onClose,
  baseURL,
  businessUnitKey,
  locale,
}) => {
  const renderContent = () => {
    switch (view) {
      case 'component-library':
        return (
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Component Library</Text.Headline>
            <Text.Body tone="secondary">
              Drag components to add them to your page
            </Text.Body>

            <ComponentLibraryGrid>
              <ComponentItem>
                <Spacings.Stack scale="xs">
                  <Text.Subheadline as="h4">Hero Banner</Text.Subheadline>
                  <Text.Detail tone="secondary">
                    Large banner with title and call-to-action
                  </Text.Detail>
                </Spacings.Stack>
              </ComponentItem>

              <ComponentItem>
                <Spacings.Stack scale="xs">
                  <Text.Subheadline as="h4">Rich Text</Text.Subheadline>
                  <Text.Detail tone="secondary">
                    Formatted text content with WYSIWYG editor
                  </Text.Detail>
                </Spacings.Stack>
              </ComponentItem>

              <ComponentItem>
                <Spacings.Stack scale="xs">
                  <Text.Subheadline as="h4">Product Slider</Text.Subheadline>
                  <Text.Detail tone="secondary">
                    Horizontal scrolling product showcase
                  </Text.Detail>
                </Spacings.Stack>
              </ComponentItem>

              <ComponentItem>
                <Spacings.Stack scale="xs">
                  <Text.Subheadline as="h4">Website Logo</Text.Subheadline>
                  <Text.Detail tone="secondary">
                    Brand logo with configurable size
                  </Text.Detail>
                </Spacings.Stack>
              </ComponentItem>
            </ComponentLibraryGrid>
          </Spacings.Stack>
        );

      case 'page-settings':
        return (
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Page Settings</Text.Headline>
            <Text.Body tone="secondary">
              Configure page properties and metadata
            </Text.Body>

            {/* Page settings form would go here */}
            <Text.Body>
              Page settings configuration will be implemented here.
            </Text.Body>
          </Spacings.Stack>
        );

      case 'component-editor':
        if (!selectedComponentId || !page) {
          return <Text.Body>No component selected</Text.Body>;
        }

        const selectedComponent = page.components.find(
          (c) => c.id === selectedComponentId
        );
        if (!selectedComponent) {
          return <Text.Body>Component not found</Text.Body>;
        }

        return (
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Edit Component</Text.Headline>
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
        );

      default:
        return <Text.Body>Unknown view</Text.Body>;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'component-library':
        return 'Component Library';
      case 'page-settings':
        return 'Page Settings';
      case 'component-editor':
        return 'Edit Component';
      default:
        return 'Sidebar';
    }
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <Text.Subheadline as="h2">{getTitle()}</Text.Subheadline>
        <CloseButton onClick={onClose}>×</CloseButton>
      </SidebarHeader>

      <SidebarContent>{renderContent()}</SidebarContent>
    </SidebarContainer>
  );
};

export default PagesSidebar;
