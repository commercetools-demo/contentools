import React, { useEffect, useState, useCallback } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { useConfigurationState } from '@commercetools-demo/contentools-state';
import {
  FrontendFacetConfiguration,
  FacetUIType,
} from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import SelectInput from '@commercetools-uikit/select-input';
import NumberInput from '@commercetools-uikit/number-input';
import FieldLabel from '@commercetools-uikit/field-label';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import styled from 'styled-components';
import Grid from '@commercetools-uikit/grid';

const UI_TYPE_OPTIONS: { value: FacetUIType; label: string }[] = [
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'color-picker', label: 'Color picker' },
  { value: 'size-selector', label: 'Size selector' },
  { value: 'range-slider', label: 'Range slider' },
  { value: 'toggle', label: 'Toggle' },
  { value: 'radio', label: 'Radio' },
  { value: 'custom', label: 'Custom' },
];

const FACET_TYPE_OPTIONS = [
  { value: 'distinct', label: 'Distinct' },
  { value: 'count', label: 'Count' },
  { value: 'ranges', label: 'Ranges' },
  { value: 'stats', label: 'Stats' },
];

type FacetKind = 'distinct' | 'count' | 'ranges' | 'stats';

/** Form-friendly representation of one facet */
interface FacetFormEntry {
  label: string;
  uiType: FacetUIType | '';
  customComponent: string;
  facetType: FacetKind;
  /** distinct */
  name: string;
  field: string;
  limit: number | '';
  /** ranges: array of { from, to, key } */
  rangeEntries: { from: string; to: string; key: string }[];
}

/** Form-friendly representation of route-specific entry (route slug + facets) */
interface RouteFacetsFormEntry {
  routeSlug: string;
  facets: FacetFormEntry[];
}

interface FormValues {
  enableProductTypeAttributes: boolean;
  genericFacetEntries: FacetFormEntry[];
  routeSpecificEntries: RouteFacetsFormEntry[];
}

function emptyFacetEntry(): FacetFormEntry {
  return {
    label: '',
    uiType: 'checkbox',
    customComponent: '',
    facetType: 'distinct',
    name: '',
    field: '',
    limit: '',
    rangeEntries: [],
  };
}

/** Map API facet (unknown shape) to form entry */
function apiFacetToFormEntry(facet: Record<string, unknown>): FacetFormEntry {
  const base = emptyFacetEntry();
  base.label = (facet.label as string) ?? '';
  base.uiType = (facet.uiType as FacetUIType) ?? 'checkbox';
  base.customComponent = (facet.customComponent as string) ?? '';
  if (facet.distinct != null && typeof facet.distinct === 'object') {
    const d = facet.distinct as Record<string, unknown>;
    base.facetType = 'distinct';
    base.name = (d.name as string) ?? '';
    base.field = (d.field as string) ?? '';
    base.limit = typeof d.limit === 'number' ? d.limit : '';
  } else if (facet.count != null && typeof facet.count === 'object') {
    const c = facet.count as Record<string, unknown>;
    base.facetType = 'count';
    base.name = (c.name as string) ?? '';
  } else if (facet.ranges != null && typeof facet.ranges === 'object') {
    const r = facet.ranges as Record<string, unknown>;
    base.facetType = 'ranges';
    base.name = (r.name as string) ?? '';
    base.field = (r.field as string) ?? '';
    const ranges = (r.ranges as Array<Record<string, unknown>>) ?? [];
    base.rangeEntries = ranges.map((x) => ({
      from: (x.from != null ? String(x.from) : '') as string,
      to: (x.to != null ? String(x.to) : '') as string,
      key: (x.key as string) ?? '',
    }));
  } else if (facet.stats != null && typeof facet.stats === 'object') {
    const s = facet.stats as Record<string, unknown>;
    base.facetType = 'stats';
    base.name = (s.name as string) ?? '';
    base.field = (s.field as string) ?? '';
  }
  return base;
}

/** Build API facet object from form entry */
function formEntryToApiFacet(entry: FacetFormEntry): Record<string, unknown> {
  const out: Record<string, unknown> = {
    label: entry.label,
    ...(entry.uiType ? { uiType: entry.uiType } : {}),
    ...(entry.customComponent
      ? { customComponent: entry.customComponent }
      : {}),
  };
  if (entry.facetType === 'distinct') {
    out.distinct = {
      name: entry.name || entry.label,
      field: entry.field,
      ...(typeof entry.limit === 'number' ? { limit: entry.limit } : {}),
    };
  } else if (entry.facetType === 'count') {
    out.count = { name: entry.name || entry.label };
  } else if (entry.facetType === 'ranges') {
    out.ranges = {
      name: entry.name || entry.label,
      field: entry.field,
      ranges: entry.rangeEntries
        .filter((r) => r.from !== '' || r.to !== '' || r.key !== '')
        .map((r) => ({
          ...(r.from ? { from: r.from } : {}),
          ...(r.to ? { to: r.to } : {}),
          ...(r.key ? { key: r.key } : {}),
        })),
    };
  } else if (entry.facetType === 'stats') {
    out.stats = { name: entry.name || entry.label, field: entry.field };
  }
  return out;
}

function configToFormValues(
  config: FrontendFacetConfiguration | null
): FormValues {
  if (config == null || typeof config !== 'object') {
    return {
      enableProductTypeAttributes: false,
      genericFacetEntries: [],
      routeSpecificEntries: [],
    };
  }
  const genericFacets = Array.isArray(config.genericFacets)
    ? config.genericFacets
    : [];
  const routeSpecificFacets =
    config.routeSpecificFacets != null &&
    typeof config.routeSpecificFacets === 'object'
      ? config.routeSpecificFacets
      : {};
  return {
    enableProductTypeAttributes: config.enableProductTypeAttributes ?? false,
    genericFacetEntries: (
      genericFacets as unknown as Record<string, unknown>[]
    ).map((f) => apiFacetToFormEntry(f)),
    routeSpecificEntries: Object.entries(routeSpecificFacets).map(
      ([routeSlug, facets]) => ({
        routeSlug,
        facets: (facets as unknown as Record<string, unknown>[]).map((f) =>
          apiFacetToFormEntry(f)
        ),
      })
    ),
  };
}

function formValuesToConfig(values: FormValues): FrontendFacetConfiguration {
  const routeSpecificFacets: Record<string, Record<string, unknown>[]> = {};
  for (const { routeSlug, facets } of values.routeSpecificEntries) {
    if (routeSlug.trim()) {
      routeSpecificFacets[routeSlug.trim()] = facets.map(formEntryToApiFacet);
    }
  }
  return {
    enableProductTypeAttributes: values.enableProductTypeAttributes,
    genericFacets: values.genericFacetEntries.map(
      formEntryToApiFacet
    ) as unknown as FrontendFacetConfiguration['genericFacets'],
    routeSpecificFacets:
      routeSpecificFacets as unknown as FrontendFacetConfiguration['routeSpecificFacets'],
  };
}

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
  margin-bottom: 1rem;
`;

const FacetCard = styled(Card)`
  margin-bottom: 1rem;
`;

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const FacetEditor: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const {
    facetConfiguration,
    loading,
    error,
    fetchFacet,
    saveFacet,
    clearError,
  } = useConfigurationState();

  const [initialValues, setInitialValues] = useState<FormValues>(() =>
    configToFormValues(null)
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchFacet(hydratedUrl);
  }, [fetchFacet, hydratedUrl]);

  useEffect(() => {
    setInitialValues(configToFormValues(facetConfiguration));
  }, [facetConfiguration]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      setSaving(true);
      setSaveSuccess(false);
      clearError();
      try {
        await saveFacet(hydratedUrl, formValuesToConfig(values));
        setSaveSuccess(true);
      } finally {
        setSaving(false);
      }
    },
    [saveFacet, clearError, hydratedUrl]
  );

  if (loading && facetConfiguration == null) {
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
      <Text.Headline as="h1">Facet configuration</Text.Headline>
      {error && <Text.Body tone="critical">{error}</Text.Body>}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <Card>
              <Spacings.Stack scale="m">
                <FormSection>
                  <FieldLabel title="Enable product type attributes (auto-generate facets)" />
                  <CheckboxInput
                    name="enableProductTypeAttributes"
                    value="enableProductTypeAttributes"
                    isChecked={values.enableProductTypeAttributes}
                    onChange={(e) =>
                      setFieldValue(
                        'enableProductTypeAttributes',
                        (e.target as HTMLInputElement).checked
                      )
                    }
                  />
                </FormSection>

                <FieldArray name="genericFacetEntries">
                  {({ push, remove }) => (
                    <>
                      <Spacings.Inline
                        scale="m"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Spacings.Stack scale="m" alignItems="flex-start">
                          <Text.Headline as="h2">Generic facets</Text.Headline>
                          <Text.Body tone="secondary">
                            Facets shown on every product listing page.
                          </Text.Body>
                        </Spacings.Stack>
                        <SecondaryButton
                          label="Add generic facet"
                          iconLeft={<PlusBoldIcon />}
                          onClick={() => push(emptyFacetEntry())}
                        />
                      </Spacings.Inline>

                      <Grid
                        gridGap="16px"
                        gridAutoColumns="1fr"
                        gridTemplateColumns="repeat(3, 1fr)"
                      >
                        {values.genericFacetEntries.map((facet, index) => (
                          <Grid.Item key={index}>
                            <FacetCard>
                              <Spacings.Stack scale="m">
                                <InlineRow
                                  style={{ justifyContent: 'space-between' }}
                                >
                                  <Text.Subheadline as="h4">
                                    Facet {index + 1}
                                  </Text.Subheadline>
                                  <FlatButton
                                    icon={<BinLinearIcon />}
                                    label="Remove facet"
                                    onClick={() => remove(index)}
                                  />
                                </InlineRow>
                                <FormSection>
                                  <FieldLabel
                                    title="Label"
                                    htmlFor={`genericFacetEntries.${index}.label`}
                                  />
                                  <TextInput
                                    name={`genericFacetEntries.${index}.label`}
                                    value={facet.label}
                                    onChange={handleChange}
                                  />
                                </FormSection>
                                <FormSection>
                                  <FieldLabel
                                    title="UI type"
                                    htmlFor={`genericFacetEntries.${index}.uiType`}
                                  />
                                  <SelectInput
                                    name={`genericFacetEntries.${index}.uiType`}
                                    value={facet.uiType || 'checkbox'}
                                    onChange={handleChange}
                                    options={UI_TYPE_OPTIONS}
                                  />
                                </FormSection>
                                <FormSection>
                                  <FieldLabel
                                    title="Custom component (optional)"
                                    htmlFor={`genericFacetEntries.${index}.customComponent`}
                                  />
                                  <TextInput
                                    name={`genericFacetEntries.${index}.customComponent`}
                                    value={facet.customComponent}
                                    onChange={handleChange}
                                  />
                                </FormSection>
                                <FormSection>
                                  <FieldLabel
                                    title="Facet type"
                                    htmlFor={`genericFacetEntries.${index}.facetType`}
                                  />
                                  <SelectInput
                                    name={`genericFacetEntries.${index}.facetType`}
                                    value={facet.facetType}
                                    onChange={handleChange}
                                    options={FACET_TYPE_OPTIONS}
                                  />
                                </FormSection>
                                <FormSection>
                                  <FieldLabel
                                    title="Name"
                                    htmlFor={`genericFacetEntries.${index}.name`}
                                  />
                                  <TextInput
                                    name={`genericFacetEntries.${index}.name`}
                                    value={facet.name}
                                    onChange={handleChange}
                                    placeholder="Facet result name"
                                  />
                                </FormSection>
                                {(facet.facetType === 'distinct' ||
                                  facet.facetType === 'ranges' ||
                                  facet.facetType === 'stats') && (
                                  <FormSection>
                                    <FieldLabel
                                      title="Field"
                                      htmlFor={`genericFacetEntries.${index}.field`}
                                    />
                                    <TextInput
                                      name={`genericFacetEntries.${index}.field`}
                                      value={facet.field}
                                      onChange={handleChange}
                                      placeholder="e.g. variants.attributes.color"
                                    />
                                  </FormSection>
                                )}
                                {facet.facetType === 'distinct' && (
                                  <FormSection>
                                    <FieldLabel
                                      title="Limit (optional)"
                                      htmlFor={`genericFacetEntries.${index}.limit`}
                                    />
                                    <NumberInput
                                      name={`genericFacetEntries.${index}.limit`}
                                      value={
                                        facet.limit === '' ? '' : facet.limit
                                      }
                                      onChange={handleChange}
                                    />
                                  </FormSection>
                                )}
                                {facet.facetType === 'ranges' && (
                                  <FormSection>
                                    <FieldArray
                                      name={`genericFacetEntries.${index}.rangeEntries`}
                                    >
                                      {({
                                        push: pushRange,
                                        remove: removeRange,
                                      }) => (
                                        <>
                                          <Spacings.Inline
                                            scale="m"
                                            justifyContent="space-between"
                                            alignItems="center"
                                          >
                                            <Spacings.Stack
                                              scale="m"
                                              alignItems="flex-start"
                                            >
                                              <Text.Body fontWeight="bold">
                                                Ranges
                                              </Text.Body>
                                            </Spacings.Stack>
                                            <SecondaryButton
                                              label="Add range"
                                              iconLeft={<PlusBoldIcon />}
                                              onClick={() =>
                                                pushRange({
                                                  from: '',
                                                  to: '',
                                                  key: '',
                                                })
                                              }
                                            />
                                          </Spacings.Inline>
                                          {(facet.rangeEntries || []).map(
                                            (range, ri) => (
                                              <InlineRow key={ri}>
                                                <TextInput
                                                  name={`genericFacetEntries.${index}.rangeEntries.${ri}.from`}
                                                  value={range.from}
                                                  onChange={handleChange}
                                                  placeholder="From"
                                                />
                                                <TextInput
                                                  name={`genericFacetEntries.${index}.rangeEntries.${ri}.to`}
                                                  value={range.to}
                                                  onChange={handleChange}
                                                  placeholder="To"
                                                />
                                                <TextInput
                                                  name={`genericFacetEntries.${index}.rangeEntries.${ri}.key`}
                                                  value={range.key}
                                                  onChange={handleChange}
                                                  placeholder="Key"
                                                />
                                                <FlatButton
                                                  icon={<BinLinearIcon />}
                                                  label="Remove range"
                                                  onClick={() =>
                                                    removeRange(ri)
                                                  }
                                                />
                                              </InlineRow>
                                            )
                                          )}
                                        </>
                                      )}
                                    </FieldArray>
                                  </FormSection>
                                )}
                              </Spacings.Stack>
                            </FacetCard>
                          </Grid.Item>
                        ))}
                      </Grid>
                    </>
                  )}
                </FieldArray>

                <FieldArray name="routeSpecificEntries">
                  {({ push: pushRoute, remove: removeRoute }) => (
                    <>
                      <Spacings.Inline
                        scale="m"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Spacings.Stack scale="m" alignItems="flex-start">
                          <Text.Headline as="h2">
                            Route-specific facets
                          </Text.Headline>
                          <Text.Body tone="secondary">
                            Additional facets by route/category slug.
                          </Text.Body>
                        </Spacings.Stack>
                        <SecondaryButton
                          label="Add route-specific facets"
                          iconLeft={<PlusBoldIcon />}
                          onClick={() =>
                            pushRoute({
                              routeSlug: '',
                              facets: [],
                            })
                          }
                        />
                      </Spacings.Inline>
                      <Grid
                        gridGap="16px"
                        gridAutoColumns="1fr"
                        gridTemplateColumns="repeat(3, 1fr)"
                      >
                      {values.routeSpecificEntries.map(
                        (routeEntry, routeIndex) => (
                          <FacetCard key={routeIndex}>
                            <Spacings.Stack scale="m">
                              <InlineRow
                                style={{ justifyContent: 'space-between' }}
                              >
                                <Text.Subheadline as="h4">
                                  Route: {routeEntry.routeSlug || '(new)'}
                                </Text.Subheadline>
                                <FlatButton
                                  icon={<BinLinearIcon />}
                                  label="Remove route"
                                  onClick={() => removeRoute(routeIndex)}
                                />
                              </InlineRow>
                              <FormSection>
                                <FieldLabel
                                  title="Route slug"
                                  htmlFor={`routeSpecificEntries.${routeIndex}.routeSlug`}
                                />
                                <TextInput
                                  name={`routeSpecificEntries.${routeIndex}.routeSlug`}
                                  value={routeEntry.routeSlug}
                                  onChange={handleChange}
                                  placeholder="e.g. category-slug"
                                />
                              </FormSection>
                              <FieldArray
                                name={`routeSpecificEntries.${routeIndex}.facets`}
                              >
                                {({ push: pushFacet, remove: removeFacet }) => (
                                  <>
                                    <Spacings.Inline
                                      scale="m"
                                      justifyContent="space-between"
                                      alignItems="center"
                                    >
                                      <Spacings.Stack
                                        scale="m"
                                        alignItems="flex-start"
                                      >
                                        <Text.Body fontWeight="bold">
                                          Facets
                                        </Text.Body>
                                      </Spacings.Stack>
                                      <SecondaryButton
                                        label="Add facet to route"
                                        iconLeft={<PlusBoldIcon />}
                                        onClick={() =>
                                          pushFacet(emptyFacetEntry())
                                        }
                                      />
                                    </Spacings.Inline>

                                    {routeEntry.facets.map(
                                      (facet, facetIndex) => (
                                        <FacetCard key={facetIndex}>
                                          <Spacings.Stack scale="s">
                                            <InlineRow
                                              style={{
                                                justifyContent: 'space-between',
                                              }}
                                            >
                                              <Text.Body fontWeight="bold">
                                                Facet {facetIndex + 1}
                                              </Text.Body>
                                              <FlatButton
                                                icon={<BinLinearIcon />}
                                                label="Remove"
                                                onClick={() =>
                                                  removeFacet(facetIndex)
                                                }
                                              />
                                            </InlineRow>
                                            <InlineRow>
                                              <TextInput
                                                name={`routeSpecificEntries.${routeIndex}.facets.${facetIndex}.label`}
                                                value={facet.label}
                                                onChange={handleChange}
                                                placeholder="Label"
                                              />
                                              <SelectInput
                                                name={`routeSpecificEntries.${routeIndex}.facets.${facetIndex}.facetType`}
                                                value={facet.facetType}
                                                onChange={handleChange}
                                                options={FACET_TYPE_OPTIONS}
                                              />
                                              <TextInput
                                                name={`routeSpecificEntries.${routeIndex}.facets.${facetIndex}.name`}
                                                value={facet.name}
                                                onChange={handleChange}
                                                placeholder="Name"
                                              />
                                              {(facet.facetType ===
                                                'distinct' ||
                                                facet.facetType === 'ranges' ||
                                                facet.facetType ===
                                                  'stats') && (
                                                <TextInput
                                                  name={`routeSpecificEntries.${routeIndex}.facets.${facetIndex}.field`}
                                                  value={facet.field}
                                                  onChange={handleChange}
                                                  placeholder="Field"
                                                />
                                              )}
                                            </InlineRow>
                                          </Spacings.Stack>
                                        </FacetCard>
                                      )
                                    )}
                                  </>
                                )}
                              </FieldArray>
                            </Spacings.Stack>
                          </FacetCard>
                          )
                        )}
                      </Grid>
                    </>
                  )}
                </FieldArray>

                <Spacings.Inline>
                  <PrimaryButton
                    type="submit"
                    label={saving ? 'Saving...' : 'Save'}
                    isDisabled={saving}
                  />
                  {saveSuccess && <Text.Body tone="positive">Saved.</Text.Body>}
                </Spacings.Inline>
              </Spacings.Stack>
            </Card>
          </Form>
        )}
      </Formik>
    </Spacings.Stack>
  );
};

export default FacetEditor;
