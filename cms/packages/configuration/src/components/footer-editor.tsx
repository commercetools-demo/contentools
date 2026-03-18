import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useConfigurationState } from '@commercetools-demo/contentools-state';
import { FooterConfiguration } from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styled from 'styled-components';
import TextField from '@commercetools-uikit/text-field';
import FieldLabel from '@commercetools-uikit/field-label';

const DEFAULT_FOOTER: FooterConfiguration = {
  copyrightText: '',
  columns: [],
  showSocialLinks: false,
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

const FooterEditor: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const history = useHistory();
  const { footer, loading, error, fetchFooter, saveFooter, clearError } =
    useConfigurationState();

  const [formValues, setFormValues] =
    useState<FooterConfiguration>(DEFAULT_FOOTER);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchFooter(hydratedUrl);
  }, [fetchFooter, hydratedUrl]);

  useEffect(() => {
    if (footer != null && typeof footer === 'object') {
      setFormValues({
        copyrightText: footer.copyrightText ?? '',
        columns: footer.columns ?? [],
        showSocialLinks: footer.showSocialLinks ?? false,
      });
    } else {
      setFormValues(DEFAULT_FOOTER);
    }
  }, [footer]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveSuccess(false);
    clearError();
    try {
      await saveFooter(hydratedUrl, formValues);
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }, [formValues, saveFooter, clearError, hydratedUrl]);

  if (loading && footer == null) {
    return (
      <Spacings.Stack scale="l">
        {backButton && (
          <FlatButton
            onClick={backButton.onClick}
            label={backButton.label}
            icon={backButton.icon as any}
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
          icon={backButton.icon as any}
        />
      )}
      <Text.Headline as="h1">Footer configuration</Text.Headline>
      {error && <Text.Body tone="critical">{error}</Text.Body>}
      <Card>
        <Spacings.Stack scale="m">
          <FormSection>
            <TextField
              title="Copyright text"
              value={formValues.copyrightText}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  copyrightText: (e.target as HTMLInputElement).value,
                }))
              }
            />
          </FormSection>
          <FormSection>
            <FieldLabel
              title="Show social links"
              htmlFor="showSocialLinks"
            />
            <CheckboxInput
              name="showSocialLinks"
              isChecked={formValues.showSocialLinks ?? false}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, showSocialLinks: e.target.checked }))}
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

export default FooterEditor;
