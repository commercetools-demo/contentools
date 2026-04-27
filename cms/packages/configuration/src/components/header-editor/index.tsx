import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useConfigurationState } from '@commercetools-demo/contentools-state';
import { HeaderConfiguration } from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styled from 'styled-components';
import { DEFAULT_HEADER, DEFAULT_MAIN_ROW_ORDER } from '../../constants';
import { DefaultVariantSection } from './default-variant-section';
import { VariantVisibilitySection } from './variant-visibility-section';
import { MainRowOrderSection } from './main-row-order-section';
import { NavigationSection } from './navigation-section';
import { UtilityBarSection } from './utility-bar-section';
import Grid from '@commercetools-uikit/grid';

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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function getInitialValues(
  header: HeaderConfiguration | null
): HeaderConfiguration {
  if (header == null || typeof header !== 'object') {
    return { ...DEFAULT_HEADER };
  }
  const config = {
    defaultVariant: header.defaultVariant ?? DEFAULT_HEADER.defaultVariant,
    routeVariantOverrides: header.routeVariantOverrides,
    variantMap: header.variantMap ?? DEFAULT_HEADER.variantMap,
    navigation: Array.isArray(header.navigation) ? header.navigation : [],
    utilityBar: header.utilityBar ?? DEFAULT_HEADER.utilityBar,
    logo: header.logo ?? DEFAULT_HEADER.logo,
    mainRowOrder: (header as { mainRowOrder?: unknown }).mainRowOrder ?? [
      ...DEFAULT_MAIN_ROW_ORDER,
    ],
    businessModel: header.businessModel ?? DEFAULT_HEADER.businessModel,
    tenantOverrides: header.tenantOverrides,
  };
  return config as HeaderConfiguration;
}

const HeaderEditor: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const history = useHistory();
  const { header, loading, error, fetchHeader, saveHeader, clearError } =
    useConfigurationState();

  const [initialValues, setInitialValues] =
    useState<HeaderConfiguration>(DEFAULT_HEADER);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchHeader(hydratedUrl);
  }, [hydratedUrl, fetchHeader]);

  useEffect(() => {
    setInitialValues(getInitialValues(header));
  }, [header]);

  const handleSubmit = useCallback(
    async (values: HeaderConfiguration) => {
      setSaving(true);
      setSaveSuccess(false);
      clearError();
      try {
        await saveHeader(hydratedUrl, values);
        setSaveSuccess(true);
      } finally {
        setSaving(false);
      }
    },
    [hydratedUrl, saveHeader, clearError]
  );

  if (loading && header == null) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Spacings.Stack scale="l">
      {backButton && (
        <FlatButton
          onClick={() => history.push('/')}
          label={backButton.label}
          icon={backButton.icon as React.ReactElement<Record<string, unknown>>}
        >
          {backButton.label}
        </FlatButton>
      )}
      <Text.Headline as="h1">Header configuration</Text.Headline>
      <Text.Body tone="secondary">
        Configure navigation, logo, visibility, and utility bar.
      </Text.Body>

      {error && (
        <Card>
          <Spacings.Stack scale="m">
            <Text.Headline as="h2">Error</Text.Headline>
            <Text.Body tone="critical">{error}</Text.Body>
          </Spacings.Stack>
        </Card>
      )}

      {saveSuccess && (
        <Text.Body tone="positive">
          Header configuration saved successfully.
        </Text.Body>
      )}

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <Grid
              gridGap="16px"
              gridAutoColumns="1fr"
              gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            >
              <Grid.Item>
                <DefaultVariantSection />
              </Grid.Item>
              <Grid.Item>
                <VariantVisibilitySection />
              </Grid.Item>
              <Grid.Item>
                <MainRowOrderSection />
              </Grid.Item>
              <Grid.Item>
                <NavigationSection />
              </Grid.Item>
              <Grid.Item>
                <UtilityBarSection />
              </Grid.Item>
              <Spacings.Inline>
                <PrimaryButton
                  type="submit"
                  label={saving ? 'Saving…' : 'Save'}
                  isDisabled={saving}
                />
                <SecondaryButton
                  type="button"
                  label="Reset"
                  onClick={() => formik.resetForm()}
                  isDisabled={!formik.dirty || saving}
                />
              </Spacings.Inline>
            </Grid>
          </Form>
        )}
      </Formik>
    </Spacings.Stack>
  );
};

export default HeaderEditor;
