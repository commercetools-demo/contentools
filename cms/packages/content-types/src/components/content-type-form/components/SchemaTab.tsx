import { useStateDatasource } from '@commercetools-demo/contentools-state';
import {
  ContentTypeData,
  PropertySchema,
} from '@commercetools-demo/contentools-types';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import FieldLabel from '@commercetools-uikit/field-label';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import {
  formatDefaultValue,
  getDefaultValuePlaceholder,
  isDefaultValueVisible,
  parseDefaultValue,
} from '../utils/schema';
import { SelectInput } from '@commercetools-demo/contentools-ui-components';

const SchemaBuilder = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const PropertyItem = styled.div`
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: #f9f9f9;
`;

const PropertyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
`;

const PropertyInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
`;

const PropertyActions = styled.div`
  display: flex;
  gap: 10px;
`;

const PropertyDetails = styled.div`
  padding: 0 15px 15px 15px;
  border-top: 1px solid #e0e0e0;
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 15px;
  align-items: end;
`;

const AddPropertyForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 15px;
  align-items: end;
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: #fafafa;
`;

const typeOptions = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  // { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
  { value: 'file', label: 'File' },
  { value: 'datasource', label: 'Datasource' },
];

export interface SchemaTabProps {
  contentType: ContentTypeData;
  onContentTypeChange: (updates: Partial<ContentTypeData>) => void;
  baseURL: string;
  businessUnitKey: string;
}

const SchemaTab: React.FC<SchemaTabProps> = ({
  contentType,
  onContentTypeChange,
  baseURL,
  businessUnitKey,
}) => {
  const { datasources: availableDatasources } = useStateDatasource();

  const [newProperty, setNewProperty] = useState({
    key: '',
    label: '',
    type: 'string' as PropertySchema['type'],
    defaultValue: '',
    datasourceType: undefined as string | undefined,
  });

  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(
    new Set()
  );

  const propertyEntries = Object.entries(
    contentType.metadata.propertySchema || {}
  );

  const togglePropertyExpanded = useCallback((propertyKey: string) => {
    setExpandedProperties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(propertyKey)) {
        newSet.delete(propertyKey);
      } else {
        newSet.add(propertyKey);
      }
      return newSet;
    });
  }, []);

  const handleAddProperty = useCallback(() => {
    if (!newProperty.key || !newProperty.label) return;

    const propertySchema: PropertySchema = {
      type: newProperty.type,
      label: newProperty.label,
      required: false,
      order: Object.keys(contentType.metadata.propertySchema || {}).length,
    };

    // Add datasourceType if it's a datasource property
    if (newProperty.type === 'datasource' && newProperty.datasourceType) {
      propertySchema.datasourceType = newProperty.datasourceType;
    }

    const updatedSchema = {
      ...contentType.metadata.propertySchema,
      [newProperty.key]: propertySchema,
    };

    // Add default value to defaultProperties if provided
    const updatedDefaultProperties = {
      ...contentType.metadata.defaultProperties,
    };
    if (newProperty.defaultValue) {
      const parsedValue = parseDefaultValue(
        newProperty.defaultValue,
        newProperty.type
      );
      updatedDefaultProperties[newProperty.key] = parsedValue;
    }

    onContentTypeChange({
      metadata: {
        ...contentType.metadata,
        propertySchema: updatedSchema,
        defaultProperties: updatedDefaultProperties,
      },
    });

    // Reset form
    setNewProperty({
      key: '',
      label: '',
      type: 'string',
      defaultValue: '',
      datasourceType: undefined,
    });
  }, [newProperty, contentType, onContentTypeChange]);

  const handleRemoveProperty = useCallback(
    (propertyKey: string) => {
      const updatedSchema = { ...contentType.metadata.propertySchema };
      delete updatedSchema[propertyKey];

      // Remove from defaultProperties
      const updatedDefaultProperties = {
        ...contentType.metadata.defaultProperties,
      };
      delete updatedDefaultProperties[propertyKey];

      onContentTypeChange({
        metadata: {
          ...contentType.metadata,
          propertySchema: updatedSchema,
          defaultProperties: updatedDefaultProperties,
        },
      });
    },
    [contentType, onContentTypeChange]
  );

  const handlePropertyUpdate = useCallback(
    (propertyKey: string, updates: Partial<PropertySchema>) => {
      const updatedSchema = {
        ...contentType.metadata.propertySchema,
        [propertyKey]: {
          ...contentType.metadata.propertySchema[propertyKey],
          ...updates,
        },
      };

      onContentTypeChange({
        metadata: {
          ...contentType.metadata,
          propertySchema: updatedSchema,
        },
      });
    },
    [contentType, onContentTypeChange]
  );

  const handleDefaultValueChange = useCallback(
    (propertyKey: string, value: string, type: PropertySchema['type']) => {
      const updatedDefaultProperties = {
        ...contentType.metadata.defaultProperties,
      };

      if (value.trim() === '') {
        // Remove default value if empty
        delete updatedDefaultProperties[propertyKey];
      } else {
        // Parse and set default value
        const parsedValue = parseDefaultValue(value, type);
        updatedDefaultProperties[propertyKey] = parsedValue;
      }

      onContentTypeChange({
        metadata: {
          ...contentType.metadata,
          defaultProperties: updatedDefaultProperties,
        },
      });
    },
    [contentType, onContentTypeChange]
  );

  return (
    <Spacings.Stack scale="m">
      <Text.Subheadline as="h4">Property Schema</Text.Subheadline>

      <Text.Detail>
        Define the properties that content items of this type will have. Each
        property will become an editable field in the content editor.
      </Text.Detail>

      <SchemaBuilder>
        <Text.Body fontWeight="medium">Current Properties</Text.Body>

        {propertyEntries.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Text.Detail tone="secondary">
              No properties defined yet. Add your first property below.
            </Text.Detail>
          </div>
        ) : (
          <Spacings.Stack scale="s">
            {propertyEntries.map(([key, property]) => (
              <PropertyItem key={key}>
                <PropertyHeader>
                  <PropertyInfo>
                    <Text.Body fontWeight="medium">{property.label}</Text.Body>
                    <Text.Detail>
                      Key: {key} • Type: {property.type}
                      {property.required && ' • Required'}
                      {contentType.metadata.defaultProperties?.[key] &&
                        ` • Default: ${formatDefaultValue(
                          contentType.metadata.defaultProperties[key],
                          property.type
                        )}`}
                    </Text.Detail>
                  </PropertyInfo>
                  <PropertyActions>
                    <SecondaryButton
                      size="small"
                      label={
                        expandedProperties.has(key) ? 'Collapse' : 'Expand'
                      }
                      onClick={() => togglePropertyExpanded(key)}
                    />
                    <SecondaryButton
                      size="small"
                      label="Remove"
                      onClick={() => handleRemoveProperty(key)}
                    />
                  </PropertyActions>
                </PropertyHeader>

                {expandedProperties.has(key) && (
                  <PropertyDetails>
                    <div>
                      <FieldLabel
                        title="Default Value"
                        htmlFor={`default-${key}`}
                      />
                      <TextInput
                        id={`default-${key}`}
                        value={formatDefaultValue(
                          contentType.metadata.defaultProperties?.[key],
                          property.type
                        )}
                        onChange={(e) =>
                          handleDefaultValueChange(
                            key,
                            e.target.value,
                            property.type
                          )
                        }
                        placeholder={getDefaultValuePlaceholder(property.type)}
                      />
                    </div>

                    <div>
                      <CheckboxInput
                        value="required"
                        isChecked={property.required || false}
                        onChange={() =>
                          handlePropertyUpdate(key, {
                            required: !property.required,
                          })
                        }
                      >
                        Required field
                      </CheckboxInput>
                    </div>

                    <div>
                      <SecondaryButton
                        size="small"
                        label="Update"
                        onClick={() => {
                          // Additional update logic can be added here
                          console.log('Property updated:', key);
                        }}
                      />
                    </div>
                  </PropertyDetails>
                )}
              </PropertyItem>
            ))}
          </Spacings.Stack>
        )}

        <Spacings.Stack scale="m">
          <Text.Body fontWeight="medium">Add New Property</Text.Body>

          <AddPropertyForm>
            <div>
              <FieldLabel title="Property Key" htmlFor="property-key" />
              <TextInput
                id="property-key"
                value={newProperty.key}
                onChange={(e) =>
                  setNewProperty((prev) => ({ ...prev, key: e.target.value }))
                }
                placeholder="e.g., title"
              />
            </div>

            <div>
              <FieldLabel title="Display Label" htmlFor="property-label" />
              <TextInput
                id="property-label"
                value={newProperty.label}
                onChange={(e) =>
                  setNewProperty((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder="e.g., Title"
              />
            </div>

            <div>
              <FieldLabel title="Type" htmlFor="property-type" />
              <SelectInput
                id="property-type"
                value={newProperty.type}
                onChange={(e) =>
                  setNewProperty((prev) => ({
                    ...prev,
                    type: e.target.value as PropertySchema['type'],
                  }))
                }
                options={typeOptions}
              />
            </div>

            {isDefaultValueVisible(newProperty.type) && (
              <div>
                <FieldLabel
                  title="Default Value"
                  htmlFor="new-property-default"
                />
                <TextInput
                  id="new-property-default"
                  value={newProperty.defaultValue}
                  onChange={(e) =>
                    setNewProperty((prev) => ({
                      ...prev,
                      defaultValue: e.target.value,
                    }))
                  }
                  placeholder={getDefaultValuePlaceholder(newProperty.type)}
                />
              </div>
            )}

            {newProperty.type === 'datasource' && (
              <div>
                <FieldLabel
                  title="Datasource Type"
                  htmlFor="new-property-datasource"
                />
                <SelectInput
                  id="new-property-datasource"
                  value={newProperty.datasourceType}
                  onChange={(e) =>
                    setNewProperty((prev) => ({
                      ...prev,
                      datasourceType: e.target.value as string,
                    }))
                  }
                  options={availableDatasources.map((ds) => ({
                    label: ds.name,
                    value: ds.key,
                  }))}
                />
              </div>
            )}

            <PrimaryButton
              size="small"
              label="Add Property"
              onClick={handleAddProperty}
              isDisabled={
                !newProperty.key ||
                !newProperty.label ||
                (newProperty.type === 'datasource' &&
                  !newProperty.datasourceType)
              }
            />
          </AddPropertyForm>
        </Spacings.Stack>
      </SchemaBuilder>
    </Spacings.Stack>
  );
};

export default SchemaTab;
