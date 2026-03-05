import React, { useEffect, useState, useCallback } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { useConfigurationState } from '@commercetools-demo/contentools-state';
import {
  CategoryListingConfiguration,
  CategoryListingSortOption,
} from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import NumberInput from '@commercetools-uikit/number-input';
import SelectInput from '@commercetools-uikit/select-input';
import FieldLabel from '@commercetools-uikit/field-label';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import styled from 'styled-components';

const DEFAULT_CATEGORY_LISTING: CategoryListingConfiguration = {
  sortOptions: [],
  pageSize: 24,
  defaultSortValue: '',
};

const SORT_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

/** Form shape for one sort attribute (key + order) for easier add/remove */
interface SortAttributeEntry {
  key: string;
  order: 'asc' | 'desc';
}

/** Form shape for one sort option */
interface SortOptionFormEntry {
  label: string;
  value: string;
  sortAttributeEntries: SortAttributeEntry[];
}

function sortAttributesToEntries(attrs: Record<string, string> | undefined): SortAttributeEntry[] {
  if (!attrs || typeof attrs !== 'object') return [];
  return Object.entries(attrs).map(([key, val]) => ({
    key,
    order: (val === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc',
  }));
}

function entriesToSortAttributes(entries: SortAttributeEntry[]): Record<string, string> | undefined {
  const obj: Record<string, string> = {};
  for (const { key, order } of entries) {
    if (key.trim()) obj[key.trim()] = order;
  }
  return Object.keys(obj).length > 0 ? obj : undefined;
}

function sortOptionToFormEntry(opt: CategoryListingSortOption): SortOptionFormEntry {
  return {
    label: opt.label ?? '',
    value: opt.value ?? '',
    sortAttributeEntries: sortAttributesToEntries(opt.sortAttributes as Record<string, string> | undefined),
  };
}

function formEntryToSortOption(entry: SortOptionFormEntry): CategoryListingSortOption {
  return {
    label: entry.label,
    value: entry.value,
    sortAttributes: entriesToSortAttributes(entry.sortAttributeEntries),
  };
}

interface FormValues {
  sortOptionEntries: SortOptionFormEntry[];
  pageSize: number;
  defaultSortValue: string;
}

function configToFormValues(config: CategoryListingConfiguration | null): FormValues {
  if (config == null || typeof config !== 'object') {
    return {
      sortOptionEntries: [],
      pageSize: DEFAULT_CATEGORY_LISTING.pageSize ?? 24,
      defaultSortValue: '',
    };
  }
  const sortOptions = Array.isArray(config.sortOptions) ? config.sortOptions : [];
  return {
    sortOptionEntries: sortOptions.map(sortOptionToFormEntry),
    pageSize: config.pageSize ?? 24,
    defaultSortValue: config.defaultSortValue ?? '',
  };
}

function formValuesToConfig(values: FormValues): CategoryListingConfiguration {
  return {
    sortOptions: values.sortOptionEntries.map(formEntryToSortOption),
    pageSize: values.pageSize,
    defaultSortValue: values.defaultSortValue || undefined,
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
  margin-bottom: 1.5rem;
`;

const SortOptionCard = styled(Card)`
  margin-bottom: 1rem;
`;

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const AttributeInputWrapper = styled.div`
  min-width: 120px;
`;

const OrderSelectWrapper = styled.div`
  min-width: 140px;
`;

const CategoryListingEditor: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const {
    categoryListing,
    loading,
    error,
    fetchCategoryListing,
    saveCategoryListing,
    clearError,
  } = useConfigurationState();

  const [initialValues, setInitialValues] = useState<FormValues>(() =>
    configToFormValues(DEFAULT_CATEGORY_LISTING)
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchCategoryListing(hydratedUrl);
  }, [fetchCategoryListing, hydratedUrl]);

  useEffect(() => {
    setInitialValues(configToFormValues(categoryListing));
  }, [categoryListing]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      setSaving(true);
      setSaveSuccess(false);
      clearError();
      try {
        await saveCategoryListing(hydratedUrl, formValuesToConfig(values));
        setSaveSuccess(true);
      } finally {
        setSaving(false);
      }
    },
    [saveCategoryListing, clearError, hydratedUrl]
  );

  if (loading && categoryListing == null) {
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
      <Text.Headline as="h1">Category listing configuration</Text.Headline>
      {error && (
        <Text.Body tone="critical">{error}</Text.Body>
      )}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form>
            <Card>
              <Spacings.Stack scale="m">
                <Text.Headline as="h2">Sort options</Text.Headline>
                <Text.Body tone="secondary">
                  Add sort options with label, value, and sort attributes (e.g. price: asc, name: desc).
                </Text.Body>
                <FieldArray name="sortOptionEntries">
                  {({ push, remove }) => (
                    <>
                      {values.sortOptionEntries.map((entry, index) => (
                        <SortOptionCard key={index}>
                          <Spacings.Stack scale="m">
                            <InlineRow style={{ justifyContent: 'space-between' }}>
                              <Text.Subheadline as="h4">Sort option {index + 1}</Text.Subheadline>
                              <FlatButton
                                icon={<BinLinearIcon />}
                                label="Remove sort option"
                                onClick={() => remove(index)}
                              />
                            </InlineRow>
                            <FormSection>
                              <FieldLabel title="Label" htmlFor={`sortOptionEntries.${index}.label`} />
                              <TextInput
                                id={`sortOptionEntries.${index}.label`}
                                name={`sortOptionEntries.${index}.label`}
                                value={entry.label}
                                onChange={handleChange}
                              />
                            </FormSection>
                            <FormSection>
                              <FieldLabel title="Value" htmlFor={`sortOptionEntries.${index}.value`} />
                              <TextInput
                                id={`sortOptionEntries.${index}.value`}
                                name={`sortOptionEntries.${index}.value`}
                                value={entry.value}
                                onChange={handleChange}
                              />
                            </FormSection>
                            <FormSection>
                              <Text.Body fontWeight="bold">Sort attributes</Text.Body>
                              <Text.Body tone="secondary">
                                e.g. price: asc, name: desc
                              </Text.Body>
                              <FieldArray name={`sortOptionEntries.${index}.sortAttributeEntries`}>
                                {({ push: pushAttr, remove: removeAttr }) => (
                                  <>
                                    {(entry.sortAttributeEntries || []).map((attr, attrIndex) => (
                                      <InlineRow key={attrIndex}>
                                        <AttributeInputWrapper>
                                          <TextInput
                                            name={`sortOptionEntries.${index}.sortAttributeEntries.${attrIndex}.key`}
                                            value={attr.key}
                                            onChange={handleChange}
                                            placeholder="e.g. price, name"
                                          />
                                        </AttributeInputWrapper>
                                        <OrderSelectWrapper>
                                          <SelectInput
                                            name={`sortOptionEntries.${index}.sortAttributeEntries.${attrIndex}.order`}
                                            value={attr.order}
                                            onChange={handleChange}
                                            options={SORT_ORDER_OPTIONS}
                                          />
                                        </OrderSelectWrapper>
                                        <FlatButton
                                          icon={<BinLinearIcon />}
                                          label="Remove attribute"
                                          onClick={() => removeAttr(attrIndex)}
                                        />
                                      </InlineRow>
                                    ))}
                                    <SecondaryButton
                                      label="Add attribute"
                                      iconLeft={<PlusBoldIcon />}
                                      onClick={() => pushAttr({ key: '', order: 'asc' })}
                                    />
                                  </>
                                )}
                              </FieldArray>
                            </FormSection>
                          </Spacings.Stack>
                        </SortOptionCard>
                      ))}
                      <SecondaryButton
                        label="Add sort option"
                        iconLeft={<PlusBoldIcon />}
                        onClick={() =>
                          push({
                            label: '',
                            value: '',
                            sortAttributeEntries: [],
                          })
                        }
                      />
                    </>
                  )}
                </FieldArray>

                <FormSection>
                  <FieldLabel title="Page size" htmlFor="pageSize" />
                  <NumberInput
                    id="pageSize"
                    name="pageSize"
                    value={values.pageSize}
                    onChange={handleChange}
                  />
                </FormSection>
                <FormSection>
                  <FieldLabel title="Default sort value" htmlFor="defaultSortValue" />
                  <TextInput
                    id="defaultSortValue"
                    name="defaultSortValue"
                    value={values.defaultSortValue}
                    onChange={handleChange}
                  />
                </FormSection>
                <Spacings.Inline>
                  <PrimaryButton
                    type="submit"
                    label={saving ? 'Saving...' : 'Save'}
                    isDisabled={saving}
                  />
                  {saveSuccess && (
                    <Text.Body tone="positive">Saved.</Text.Body>
                  )}
                </Spacings.Inline>
              </Spacings.Stack>
            </Card>
          </Form>
        )}
      </Formik>
    </Spacings.Stack>
  );
};

export default CategoryListingEditor;
