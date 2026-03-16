import React, { useEffect, useState, useCallback } from 'react';
import { useConfigurationState } from '@commercetools-demo/contentools-state';
import type { B2BAccountMenuLink } from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
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

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const B2bAccountMenuLinksEditor: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const {
    b2bAccountMenuLinks,
    loading,
    error,
    fetchB2bAccountMenuLinks,
    saveB2bAccountMenuLinks,
    clearError,
  } = useConfigurationState();

  const [formValues, setFormValues] = useState<B2BAccountMenuLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchB2bAccountMenuLinks(hydratedUrl);
  }, [fetchB2bAccountMenuLinks, hydratedUrl]);

  useEffect(() => {
    if (b2bAccountMenuLinks != null && Array.isArray(b2bAccountMenuLinks)) {
      setFormValues(
        b2bAccountMenuLinks.map((link) => ({
          label: link.label ?? '',
          href: link.href ?? '',
        }))
      );
    } else {
      setFormValues([]);
    }
  }, [b2bAccountMenuLinks]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveSuccess(false);
    clearError();
    try {
      await saveB2bAccountMenuLinks(hydratedUrl, formValues);
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }, [formValues, saveB2bAccountMenuLinks, clearError, hydratedUrl]);

  const addLink = useCallback(() => {
    setFormValues((prev) => [...prev, { label: '', href: '' }]);
  }, []);

  const removeLink = useCallback((index: number) => {
    setFormValues((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateLink = useCallback(
    (index: number, field: 'label' | 'href', value: string) => {
      setFormValues((prev) =>
        prev.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        )
      );
    },
    []
  );

  if (loading && b2bAccountMenuLinks == null) {
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
      <Text.Headline as="h1">B2B Account Menu Links</Text.Headline>
      {error && <Text.Body tone="critical">{error}</Text.Body>}
      <Card>
        <Spacings.Stack scale="m">
          <Text.Body tone="secondary">
            Links shown in the B2B My Account dropdown (e.g. Dashboard, Orders,
            Quotes).
          </Text.Body>
          {formValues.map((link, index) => (
            <LinkRow key={index}>
              <TextField
                title="Label"
                value={link.label}
                onChange={(e) =>
                  updateLink(index, 'label', (e.target as HTMLInputElement).value)
                }
                placeholder="e.g. Dashboard"
              />
              <TextField
                title="URL"
                value={link.href}
                onChange={(e) =>
                  updateLink(index, 'href', (e.target as HTMLInputElement).value)
                }
                placeholder="e.g. /dashboard"
              />
              <FlatButton
                icon={<BinLinearIcon />}
                label="Remove link"
                onClick={() => removeLink(index)}
              />
            </LinkRow>
          ))}
          <SecondaryButton
            label="Add link"
            iconLeft={<PlusBoldIcon />}
            onClick={addLink}
          />
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

export default B2bAccountMenuLinksEditor;
