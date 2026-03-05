import React, { useEffect, useState, useCallback } from 'react';
import { useConfigurationState } from '@commercetools-demo/contentools-state';
import { SiteMetadata } from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styled from 'styled-components';

const DEFAULT_SITE_METADATA: SiteMetadata = {
  title: '',
  description: '',
  openGraphImageUrl: '',
};

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

const SiteMetadataEditor: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const {
    siteMetadata,
    loading,
    error,
    fetchSiteMetadata,
    saveSiteMetadata,
    clearError,
  } = useConfigurationState();

  const [formValues, setFormValues] = useState<SiteMetadata>(DEFAULT_SITE_METADATA);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSiteMetadata(hydratedUrl);
  }, [fetchSiteMetadata, hydratedUrl]);

  useEffect(() => {
    if (siteMetadata != null && typeof siteMetadata === 'object') {
      setFormValues({
        title: siteMetadata.title ?? '',
        description: siteMetadata.description ?? '',
        openGraphImageUrl: siteMetadata.openGraphImageUrl ?? '',
      });
    } else {
      setFormValues(DEFAULT_SITE_METADATA);
    }
  }, [siteMetadata]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveSuccess(false);
    clearError();
    try {
      await saveSiteMetadata(hydratedUrl, formValues);
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }, [formValues, saveSiteMetadata, clearError, hydratedUrl]);

  if (loading && siteMetadata == null) {
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
      <Text.Headline as="h1">Site metadata</Text.Headline>
      {error && (
        <Text.Body tone="critical">{error}</Text.Body>
      )}
      <Card>
        <Spacings.Stack scale="m">
          <FormSection>
            <TextInput
              title="Title"
              value={formValues.title}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  title: (e.target as HTMLInputElement).value,
                }))
              }
            />
          </FormSection>
          <FormSection>
            <TextInput
              title="Description"
              value={formValues.description ?? ''}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: (e.target as HTMLInputElement).value,
                }))
              }
            />
          </FormSection>
          <FormSection>
            <TextInput
              title="Open Graph image URL"
              value={formValues.openGraphImageUrl ?? ''}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  openGraphImageUrl: (e.target as HTMLInputElement).value,
                }))
              }
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

export default SiteMetadataEditor;
