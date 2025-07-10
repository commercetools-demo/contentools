import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ContentItem, ContentTypeMetaData, PropertySchema } from '@commercetools-demo/cms-types';
import { getAllContentTypesMetaData } from '@commercetools-demo/cms-state';
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
import { ConfirmationDialog } from '@commercetools-frontend/application-components';

const PropertyEditorContainer = styled.div`
  padding: 20px 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// Debounce utility
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface PropertyEditorProps {
  component: ContentItem;
  baseURL: string;
  businessUnitKey: string;
  isContentVersion?: boolean;
  versionedContent?: ContentItem | null;
  onComponentUpdated: (component: ContentItem) => void;
  onComponentDeleted?: (componentId: string) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  baseURL,
  businessUnitKey,
  isContentVersion = false,
  versionedContent = null,
  onComponentUpdated,
  onComponentDeleted,
}) => {
  const [editingComponent, setEditingComponent] = useState<ContentItem | null>(null);
  const [metadata, setMetadata] = useState<ContentTypeMetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fieldChanges, setFieldChanges] = useState<Record<string, any>>({});

  // Calculate diff between original and current version
  const diff = useMemo(() => {
    if (!versionedContent) return [];
    
    const nameDiff = versionedContent.name !== component.name ? ['name'] : [];
    const propertyDiff = Object.keys(versionedContent.properties || {}).filter(key => {
      return JSON.stringify(versionedContent.properties[key]) !== JSON.stringify(component.properties[key]);
    });
    
    return [...nameDiff, ...propertyDiff];
  }, [versionedContent, component]);

  // Initialize editing component
  useEffect(() => {
    const sourceComponent = versionedContent || component;
    setEditingComponent(JSON.parse(JSON.stringify(sourceComponent)));
  }, [component, versionedContent]);

  // Fetch metadata when component changes
  useEffect(() => {
    if (!editingComponent) return;

    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);

      try {
        const allMetadata = await getAllContentTypesMetaData({ baseURL });
        const metadata = allMetadata.find(m => m.type === editingComponent.type) || null;
        setMetadata(metadata);
      } catch (err) {
        setError(`Failed to load component metadata: ${err instanceof Error ? err.message : String(err)}`);
        console.error('Error loading component metadata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [editingComponent?.type, baseURL]);

  // Debounced field changes
  const debouncedFieldChanges = useDebounce(fieldChanges, 500);

  // Apply debounced changes to editing component
  useEffect(() => {
    if (!editingComponent || Object.keys(debouncedFieldChanges).length === 0) return;

    const updatedComponent = { ...editingComponent };
    
    Object.entries(debouncedFieldChanges).forEach(([key, value]) => {
      if (key === 'name') {
        updatedComponent.name = value;
      } else {
        updatedComponent.properties = {
          ...updatedComponent.properties,
          [key]: value,
        };
      }
    });

    setEditingComponent(updatedComponent);
    setFieldChanges({});
  }, [debouncedFieldChanges]);

  const handleFieldChange = useCallback((key: string, value: any) => {
    setFieldChanges(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (editingComponent) {
      onComponentUpdated(editingComponent);
    }
  }, [editingComponent, onComponentUpdated]);

  const handleDelete = useCallback(() => {
    if (editingComponent && onComponentDeleted) {
      onComponentDeleted(editingComponent.id);
      setShowDeleteConfirm(false);
    }
  }, [editingComponent, onComponentDeleted]);

  const renderField = (key: string, field: PropertySchema) => {
    if (!editingComponent) return null;

    const value = editingComponent.properties[key];
    const isHighlighted = diff.includes(key);
    const commonProps = {
      key,
      fieldKey: key,
      label: field.label,
      value: value,
      highlight: isHighlighted,
      required: field.required,
      onFieldChange: handleFieldChange,
    };

    switch (field.type) {
      case 'string':
        if (editingComponent.type === 'richText' && key === 'content') {
          return (
            <WysiwygField
              {...commonProps}
              value={value || ''}
            />
          );
        }
        return (
          <StringField
            {...commonProps}
            value={value || ''}
          />
        );
      case 'number':
        return (
          <NumberField
            {...commonProps}
            value={value}
          />
        );
      case 'boolean':
        return (
          <BooleanField
            {...commonProps}
            value={value}
          />
        );
      case 'array':
        return (
          <ArrayField
            {...commonProps}
            value={value || []}
          />
        );
      case 'file':
        return (
          <FileField
            {...commonProps}
            value={value}
            baseURL={baseURL}
            businessUnitKey={businessUnitKey}
            extensions={field.extensions || []}
          />
        );
      case 'datasource':
        return (
          <DatasourceField
            {...commonProps}
            value={value || {}}
            datasourceType={field.datasourceType || ''}
            baseURL={baseURL}
          />
        );
      default:
        return (
          <Spacings.Stack scale="s">
            <Text.Detail tone="warning">
              Unsupported field type: {field.type}
            </Text.Detail>
          </Spacings.Stack>
        );
    }
  };

  if (!editingComponent) {
    return (
      <Card>
        <Text.Body>No component selected</Text.Body>
      </Card>
    );
  }

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
      <Card>
        <Spacings.Stack scale="m">
          <Text.Headline as="h2">{editingComponent.name}</Text.Headline>
          
          <StringField
            fieldKey="name"
            label="Name"
            value={editingComponent.name || ''}
            highlight={diff.includes('name')}
            required
            onFieldChange={handleFieldChange}
          />

          {Object.entries(metadata.propertySchema).map(([key, field]) =>
            renderField(key, field)
          )}

          <ActionsContainer>
            <SecondaryButton
              label="Delete Component"
              tone="critical"
              onClick={() => setShowDeleteConfirm(true)}
            />
            <PrimaryButton
              label="Save Changes"
              onClick={handleSave}
            />
          </ActionsContainer>
        </Spacings.Stack>
      </Card>

      {showDeleteConfirm && (
        <ConfirmationDialog

          title="Delete Component"
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          size="m"
        >
          <Spacings.Stack scale="m">
            <Text.Body>
              Are you sure you want to delete the component "{editingComponent.name}"? 
              This action cannot be undone.
            </Text.Body>
            <Spacings.Inline scale="s" justifyContent="flex-end">
              <SecondaryButton
                label="Cancel"
                onClick={() => setShowDeleteConfirm(false)}
              />
              <PrimaryButton
                label="Delete"
                tone="critical"
                onClick={handleDelete}
              />
            </Spacings.Inline>
          </Spacings.Stack>
        </Modal>
      )}
    </PropertyEditorContainer>
  );
};

export default PropertyEditor; 