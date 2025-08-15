import { ContentTypeData } from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import ViewSwitcher from '@commercetools-uikit/view-switcher';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { CodeEditorTab, GeneralTab, SchemaTab } from './components';
import { useContentTypeForm } from './hooks';

const FormContainer = styled.div`
  padding: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const TabContent = styled.div`
  margin-top: 20px;
`;

export interface ContentTypeFormProps {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
  initialContentType?: ContentTypeData;
  onCreate?: (contentType: ContentTypeData) => void;
  onUpdate?: (contentType: ContentTypeData) => void;
  onCancel?: () => void;
}

type TabKey = 'general' | 'schema' | 'code';

interface Tab {
  key: TabKey;
  label: string;
}

const tabs: Tab[] = [
  { key: 'general', label: 'General' },
  { key: 'schema', label: 'Schema' },
  { key: 'code', label: 'Code Editor' },
];

const ContentTypeForm: React.FC<ContentTypeFormProps> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale,
  initialContentType,
  onCreate,
  onUpdate,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const {
    contentType,
    isValid,
    hasChanges,
    updateContentType,
    resetForm,
    validateForm,
  } = useContentTypeForm(initialContentType);

  const isEdit = Boolean(initialContentType);

  const handleTabChange = useCallback((tabKey: string) => {
    setActiveTab(tabKey as TabKey);
  }, []);

  const handleSave = useCallback(() => {
    if (isValid && hasChanges) {
      if (isEdit && onUpdate) {
        onUpdate(contentType);
      } else if (!isEdit && onCreate) {
        onCreate(contentType);
      }
    }
  }, [isValid, hasChanges, isEdit, contentType, onCreate, onUpdate]);

  const handleCancel = useCallback(() => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  }, [resetForm, onCancel]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralTab
            contentType={contentType}
            onContentTypeChange={updateContentType}
            isEdit={isEdit}
          />
        );
      case 'schema':
        return (
          <SchemaTab
            contentType={contentType}
            onContentTypeChange={updateContentType}
            baseURL={baseURL}
            businessUnitKey={businessUnitKey}
          />
        );
      case 'code':
        return (
          <CodeEditorTab
            contentType={contentType}
            baseURL={baseURL}
            businessUnitKey={businessUnitKey}
            locale={locale}
            onCodeChange={updateContentType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormContainer>
      <HeaderContainer>
        <TabContainer>
          <ViewSwitcher.Group
            selectedValue={activeTab}
            onChange={handleTabChange}
          >
            {tabs.map((tab) => (
              <ViewSwitcher.Button
                key={tab.key}
                value={tab.key}
                isDisabled={!isEdit && tab.key === 'code'}
              >
                {tab.label}
              </ViewSwitcher.Button>
            ))}
          </ViewSwitcher.Group>
        </TabContainer>
        <ActionsContainer>
          <SecondaryButton label="Cancel" onClick={handleCancel} />
          <PrimaryButton
            label={isEdit ? 'Update Content Type' : 'Create Content Type'}
            onClick={handleSave}
            isDisabled={!isValid || !hasChanges}
          />
        </ActionsContainer>
      </HeaderContainer>
      <Card>
        <Spacings.Stack scale="m">
          <TabContent>{renderTabContent()}</TabContent>
        </Spacings.Stack>
      </Card>
    </FormContainer>
  );
};

export default ContentTypeForm;
