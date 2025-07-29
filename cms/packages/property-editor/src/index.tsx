import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  ContentItem,
  ContentTypeMetaData,
  PropertySchema,
} from '@commercetools-demo/cms-types';
import { useStateContentType } from '@commercetools-demo/cms-state';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Card from '@commercetools-uikit/card';
import { StringField } from './components/string-field';
import { NumberField } from './components/number-field';
import { BooleanField } from './components/boolean-field';
import { ArrayField } from './components/array-field';
import { FileField } from './components/file-field';
import { WysiwygField } from './components/wysiwyg-field';
import { DatasourceField } from './components/datasource-field';
import { ConfirmationModal } from '@commercetools-demo/cms-ui-components';

const PropertyEditorContainer = styled.div`
  padding: 20px 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// Form values interface
interface FormValues {
  name: string;
  properties: Record<string, any>;
}

interface PropertyEditorProps {
  component: ContentItem;
  baseURL: string;
  businessUnitKey: string;
  versionedContent?: ContentItem | null;
  onComponentUpdated: (component: ContentItem) => void;
  onComponentDeleted?: (componentId: string) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  baseURL,
  businessUnitKey,
  versionedContent = null,
  onComponentUpdated,
  onComponentDeleted,
}) => {

  const { contentTypesMetaData } = useStateContentType();
  const [metadata, setMetadata] = useState<ContentTypeMetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate diff between original and current version (memoized for performance)
  const diff = useMemo(() => {
    if (!versionedContent) return [];

    const nameDiff = versionedContent.name !== component.name ? ['name'] : [];
    const propertyDiff = Object.keys(versionedContent.properties || {}).filter(
      (key) => {
        return (
          JSON.stringify(versionedContent.properties[key]) !==
          JSON.stringify(component.properties[key])
        );
      }
    );

    return [...nameDiff, ...propertyDiff];
  }, [versionedContent, component]);

  // Get initial form values (memoized to prevent unnecessary re-renders)
  const initialValues: FormValues = useMemo(() => {
    const sourceComponent = versionedContent || component;
    return {
      name: sourceComponent.name || '',
      properties: { ...sourceComponent.properties },
    };
  }, [component, versionedContent]);

  // Create validation schema based on PropertySchema
  const validationSchema = useMemo(() => {
    if (!metadata) return Yup.object({});

    const schemaObject: Record<string, any> = {
      name: Yup.string().required('Name is required'),
    };

    const propertiesSchema: Record<string, any> = {};

    Object.entries(metadata.propertySchema).forEach(([key, field]) => {
      if (field.required) {
        switch (field.type) {
          case 'string':
            propertiesSchema[key] = Yup.string().required(
              `${field.label} is required`
            );
            break;
          case 'number':
            propertiesSchema[key] = Yup.number().required(
              `${field.label} is required`
            );
            break;
          case 'boolean':
            propertiesSchema[key] = Yup.boolean().required(
              `${field.label} is required`
            );
            break;
          case 'array':
            propertiesSchema[key] = Yup.array().min(
              1,
              `${field.label} must have at least one item`
            );
            break;
          case 'file':
            propertiesSchema[key] = Yup.mixed().required(
              `${field.label} is required`
            );
            break;
          case 'datasource':
            propertiesSchema[key] = Yup.object().required(
              `${field.label} is required`
            );
            break;
        }
      }
    });

    schemaObject.properties = Yup.object(propertiesSchema);
    return Yup.object(schemaObject);
  }, [metadata]);

  // Fetch metadata when component changes
  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);

      try {
        const metadata =
          contentTypesMetaData.find((m) => m.type === component.type) || null;
        setMetadata(metadata);
      } catch (err) {
        setError(
          `Failed to load component metadata: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        console.error('Error loading component metadata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [component.type, contentTypesMetaData]);

  const handleSubmit = useCallback(
    (values: FormValues) => {
      const updatedComponent: ContentItem = {
        ...component,
        name: values.name,
        properties: values.properties,
      };
      onComponentUpdated(updatedComponent);
    },
    [component, onComponentUpdated]
  );

  const handleDelete = useCallback(() => {
    if (onComponentDeleted) {
      onComponentDeleted(component.id);
      setShowDeleteConfirm(false);
    }
  }, [component.id, onComponentDeleted]);

  // Memoize field entries to prevent unnecessary re-renders
  const fieldEntries = useMemo(() => {
    return metadata ? Object.entries(metadata.propertySchema) : [];
  }, [metadata]);

  const renderField = useCallback(
    (key: string, field: PropertySchema, formik: FormikProps<FormValues>) => {
      const value = formik.values.properties[key];
      const isHighlighted = diff.includes(key);
      const error = formik.errors.properties?.[key];
      const touched = formik.touched.properties?.[key];

      const handleFieldChange = useCallback(
        (fieldKey: string, fieldValue: any) => {
          formik.setFieldValue(`properties.${fieldKey}`, fieldValue);
        },
        [formik]
      );

      // Convert error to string for display
      const errorString =
        touched && error
          ? typeof error === 'string'
            ? error
            : JSON.stringify(error)
          : undefined;

      const commonProps = {
        key,
        fieldKey: key,
        label: field.label,
        value: value,
        highlight: isHighlighted,
        required: field.required,
        onFieldChange: handleFieldChange,
        error: errorString,
      };

      switch (field.type) {
        case 'string':
          if (component.type === 'richText' && key === 'content') {
            return <WysiwygField {...commonProps} value={value || ''} key={key} />;
          }
          return <StringField {...commonProps} value={value || ''} key={key} />;
        case 'number':
          return <NumberField {...commonProps} value={value} key={key} />;
        case 'boolean':
          return <BooleanField {...commonProps} value={value} key={key} />;
        case 'array':
          return <ArrayField {...commonProps} value={value || []} key={key} />;
        case 'file':
          return (
            <FileField
              key={key}
              fieldKey={key}
              label={field.label}
              value={value}
              highlight={isHighlighted}
              required={field.required}
              onFieldChange={handleFieldChange}
              baseURL={baseURL}
              businessUnitKey={businessUnitKey}
              extensions={field.extensions || []}
              validationError={errorString}
            />
          );
        case 'datasource':
          return (
            <DatasourceField
              key={key}
              fieldKey={key}
              label={field.label}
              value={value || {}}
              highlight={isHighlighted}
              required={field.required}
              onFieldChange={handleFieldChange}
              datasourceType={field.datasourceType || ''}
              baseURL={baseURL}
              validationError={errorString}
            />
          );
        default:
          return (
            <Spacings.Stack scale="s" key={key}>
              <Text.Detail tone="warning">
                Unsupported field type: {field.type}
              </Text.Detail>
            </Spacings.Stack>
          );
      }
    },
    [diff, baseURL, businessUnitKey, component.type]
  );

  if (loading) {
    return (
      <Card>
        <Text.Body>Loading component properties...</Text.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Text.Body>{error}</Text.Body>
      </Card>
    );
  }

  if (!metadata) {
    return (
      <Card>
        <Text.Body>No metadata available for this component</Text.Body>
      </Card>
    );
  }

  return (
    <PropertyEditorContainer>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <Card>
              <Spacings.Stack scale="m">
                <Text.Headline as="h2">{component.name}</Text.Headline>

                <StringField
                  fieldKey="name"
                  label="Name"
                  value={formik.values.name}
                  highlight={diff.includes('name')}
                  required
                  onFieldChange={useCallback(
                    (key: string, value: string) =>
                      formik.setFieldValue('name', value),
                    [formik]
                  )}
                  error={
                    formik.touched.name && formik.errors.name
                      ? typeof formik.errors.name === 'string'
                        ? formik.errors.name
                        : JSON.stringify(formik.errors.name)
                      : undefined
                  }
                />

                {fieldEntries.map(([key, field]) =>
                  renderField(key, field, formik)
                )}

                <ActionsContainer>
                  <SecondaryButton
                    label="Delete Component"
                    onClick={useCallback(
                      () => setShowDeleteConfirm(true),
                      [setShowDeleteConfirm]
                    )}
                  />
                  <PrimaryButton
                    type="submit"
                    label="Save Changes"
                    isDisabled={!formik.isValid}
                  />
                </ActionsContainer>
              </Spacings.Stack>
            </Card>
          </Form>
        )}
      </Formik>

      {showDeleteConfirm && (
        <ConfirmationModal
          onConfirm={handleDelete}
          onReject={() => setShowDeleteConfirm(false)}
          confirmTitle="Delete"
          rejectTitle="Cancel"
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          size={40}
        >
          <Spacings.Stack scale="m">
            <Text.Body>
              Are you sure you want to delete the component "{component.name}"?
              This action cannot be undone.
            </Text.Body>
            <Spacings.Inline scale="s" justifyContent="flex-end">
              <SecondaryButton
                label="Cancel"
                onClick={() => setShowDeleteConfirm(false)}
              />
              <PrimaryButton label="Delete" onClick={handleDelete} />
            </Spacings.Inline>
          </Spacings.Stack>
        </ConfirmationModal>
      )}
    </PropertyEditorContainer>
  );
};

export default PropertyEditor;
