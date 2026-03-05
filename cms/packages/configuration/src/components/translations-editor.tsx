import React, { useEffect, useState, useCallback } from 'react';
import { useConfigurationState } from '@commercetools-demo/contentools-state';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styled from 'styled-components';

interface Props {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const JsonTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  font-family: monospace;
  font-size: 12px;
`;

const TranslationsEditor: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const {
    translations,
    loading,
    error,
    fetchTranslations,
    saveTranslations,
    clearError,
  } = useConfigurationState();

  const [jsonValue, setJsonValue] = useState('{}');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchTranslations(hydratedUrl);
  }, [fetchTranslations, hydratedUrl]);

  useEffect(() => {
    if (translations != null && typeof translations === 'object') {
      setJsonValue(JSON.stringify(translations, null, 2));
    } else {
      setJsonValue('{}');
    }
  }, [translations]);

  const handleSave = useCallback(async () => {
    let value: Record<string, Record<string, unknown>>;
    try {
      value = JSON.parse(jsonValue) as Record<string, Record<string, unknown>>;
    } catch {
      return;
    }
    setSaving(true);
    setSaveSuccess(false);
    clearError();
    try {
      await saveTranslations(hydratedUrl, value);
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }, [jsonValue, saveTranslations, clearError, hydratedUrl]);

  if (loading && translations == null) {
    return (
      <Spacings.Stack scale="l">
        {backButton && (
          <FlatButton
            onClick={backButton.onClick}
            label={backButton.label}
            icon={backButton.icon as React.ReactElement}
          />
        )}
        <LoadingSpinner scale="l" />
      </Spacings.Stack>
    );
  }

  return (
    <Spacings.Stack scale="l">
      {backButton && (
        <FlatButton
          onClick={backButton.onClick}
          label={backButton.label}
          icon={backButton.icon as React.ReactElement}
        />
      )}
      <Text.Headline as="h1">Translations</Text.Headline>
      <Text.Body tone="secondary">
        Per-locale translation overrides. JSON: locale → key → value.
      </Text.Body>
      {error && (
        <Text.Body tone="critical">{error}</Text.Body>
      )}
      <Card>
        <Spacings.Stack scale="m">
          <FormSection>
            <JsonTextarea
              value={jsonValue}
              onChange={(e) => setJsonValue(e.target.value)}
              spellCheck={false}
            />
          </FormSection>
          <Spacings.Inline>
            <PrimaryButton
              label={saving ? 'Saving...' : 'Save'}
              onClick={handleSave}
              isDisabled={saving}
            />
            {saveSuccess && <Text.Body tone="positive">Saved.</Text.Body>}
          </Spacings.Inline>
        </Spacings.Stack>
      </Card>
    </Spacings.Stack>
  );
};

export default TranslationsEditor;
