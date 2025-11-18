import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  ContentItem,
  ContentTypeMetaData,
  EPropertyType,
} from '@commercetools-demo/contentools-types';
import { useStateContentType } from '@commercetools-demo/contentools-state';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Card from '@commercetools-uikit/card';

import { ConfirmationModal } from '@commercetools-demo/contentools-ui-components';
import FieldWrapper from './field-wrapper';
import GeneralPropertyFields from './general-attributes';

const PropertyEditorContainer = styled.div`
  padding: 20px 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// Form values interface
export interface PropertyEditorFormValues {
  name: string;
  startDate?: string;
  endDate?: string;
  properties: Record<string, any>;
}

export interface PropertyEditorCoreProps {
  component: ContentItem;
  metadata?: ContentTypeMetaData;
  baseURL: string;
  businessUnitKey: string;
  versionedContent?: ContentItem | null;
  showDeleteButton?: boolean;
  onChange: (component: ContentItem) => void;
  onComponentUpdated: (component: ContentItem) => void;
  onComponentDeleted?: (componentKey: string) => void;
}

const PropertyEditorCore: React.FC<PropertyEditorCoreProps> = ({
  component,
  baseURL,
  metadata: metadataProp,
  businessUnitKey,
  versionedContent = null,
  showDeleteButton = false,
  onChange,
  onComponentUpdated,
  onComponentDeleted,
}) => {
  const { contentTypes } = useStateContentType();
  const [metadata, setMetadata] = useState<ContentTypeMetaData | null>(
    metadataProp || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate diff between original and current version (memoized for performance)
  const diff = useMemo(() => {
    if (!versionedContent) return [];

    const nameDiff = versionedContent.name !== component.name ? ['name'] : [];
    const propertyDiff = Object.keys(versionedContent.properties || {})
      .filter((key) => {
        return (
          JSON.stringify(versionedContent.properties[key]) !==
          JSON.stringify(component.properties[key])
        );
      })
      .concat(
        Object.keys(component.properties || {}).filter((key) => {
          return (
            JSON.stringify(versionedContent.properties[key]) !==
            JSON.stringify(component.properties[key])
          );
        })
      )
      .filter((key, index, self) => self.indexOf(key) === index);

    return [...nameDiff, ...propertyDiff];
  }, [versionedContent, component]);

  // Get initial form values (memoized to prevent unnecessary re-renders)
  const initialValues: PropertyEditorFormValues = useMemo(() => {
    const sourceComponent = versionedContent || component;
    return {
      name: sourceComponent.name || '',
      startDate: sourceComponent.startDate || '',
      endDate: sourceComponent.endDate || '',
      properties: { ...sourceComponent.properties },
    };
  }, []);

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
          case EPropertyType.STRING:
            propertiesSchema[key] = Yup.string().required(
              `${field.label} is required`
            );
            break;
          case EPropertyType.NUMBER:
            propertiesSchema[key] = Yup.number().required(
              `${field.label} is required`
            );
            break;
          case EPropertyType.BOOLEAN:
            propertiesSchema[key] = Yup.boolean().required(
              `${field.label} is required`
            );
            break;
          case EPropertyType.ARRAY:
            propertiesSchema[key] = Yup.array().min(
              1,
              `${field.label} must have at least one item`
            );
            break;
          case EPropertyType.FILE:
            propertiesSchema[key] = Yup.mixed().required(
              `${field.label} is required`
            );
            break;
          case EPropertyType.DATASOURCE:
            propertiesSchema[key] = Yup.object().required(
              `${field.label} is required`
            );
            break;
          case EPropertyType.OBJECT:
            propertiesSchema[key] = Yup.mixed().required(
              `${field.label} is required`
            );
            break;
          case EPropertyType.RICH_TEXT:
            propertiesSchema[key] = Yup.mixed().required(
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
        const contentType =
          contentTypes.find((ct) => ct.key === component.type) || null;
        setMetadata(contentType?.metadata || null);
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

    if (!metadataProp) {
      fetchMetadata();
    }
  }, [component.type, contentTypes, metadataProp]);

  const handleSubmit = useCallback(
    (values: PropertyEditorFormValues) => {
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
      onComponentDeleted(component.key);
      setShowDeleteConfirm(false);
    }
  }, [component.id, onComponentDeleted]);

  const handleFieldChange = useCallback(
    (key: string, value: any) => {
      onChange({
        ...component,
        properties: { ...component.properties, [key]: value },
      });
    },
    [component, onChange]
  );

  const handleGeneralFieldChange = useCallback(
    (key: string, value: any) => {
      onChange({
        ...component,
        [key]: value,
      });
    },
    [component, onChange]
  );

  // Memoize field entries to prevent unnecessary re-renders
  const fieldEntries = useMemo(() => {
    return metadata ? Object.entries(metadata.propertySchema) : [];
  }, [metadata]);

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
                <Text.Headline as="h2">{formik.values.name}</Text.Headline>

                <GeneralPropertyFields
                  diff={diff}
                  onChange={handleGeneralFieldChange}
                />

                {fieldEntries.map(([key, field]) => (
                  <FieldWrapper
                    baseURL={baseURL}
                    businessUnitKey={businessUnitKey}
                    onChange={handleFieldChange}
                    key={key}
                    propKey={key}
                    field={field}
                    isHighlighted={diff.includes(key)}
                  />
                ))}

                <ActionsContainer>
                  <PrimaryButton
                    type="submit"
                    label="Save Changes"
                    isDisabled={!formik.isValid || !formik.dirty}
                  />
                  {showDeleteButton && (
                    <PrimaryButton
                      label="Delete"
                      tone="critical"
                      onClick={() => setShowDeleteConfirm(true)}
                    />
                  )}
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
          </Spacings.Stack>
        </ConfirmationModal>
      )}
    </PropertyEditorContainer>
  );
};

export default PropertyEditorCore;

