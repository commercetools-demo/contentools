import {
  EPropertyType,
  PropertySchema,
} from '@commercetools-demo/contentools-types';
import React, { useCallback } from 'react';
import { NumberField } from './components/number-field';
import { BooleanField } from './components/boolean-field';
import { ArrayField } from './components/array-field';
import { FileField } from './components/file-field';
import { WysiwygField } from './components/wysiwyg-field';
import { DatasourceField } from './components/datasource-field';
import { ObjectField } from './components/object-field';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useFormikContext } from 'formik';
import { PropertyEditorFormValues } from '.';
import { StringField } from './components/string-field';

type Props = {
  propKey: string;
  field: PropertySchema;
  isHighlighted: boolean;
  baseURL: string;
  businessUnitKey: string;
  onChange: (key: string, value: any) => void;
};

const FieldWrapper = ({
  propKey: key,
  field,
  isHighlighted,
  baseURL,
  businessUnitKey,
  onChange,
}: Props) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  const {
    values,
    errors,
    touched: formikTouched,
    setFieldValue,
  } = useFormikContext<PropertyEditorFormValues>();
  const value = values.properties[key];
  const error = errors.properties?.[key];
  const touched = formikTouched.properties?.[key];

  const handleFieldChange = useCallback((fieldValue: any) => {
    setFieldValue(`properties.${key}`, fieldValue);
    onChange(key, fieldValue);
  }, []);

  // Convert error to string for display
  const errorString =
    touched && error
      ? typeof error === 'string'
        ? error
        : JSON.stringify(error)
      : undefined;

  const commonProps = {
    hydratedUrl,
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
    case EPropertyType.STRING:
      return <StringField {...commonProps} value={value || ''} key={key} />;
    case EPropertyType.NUMBER:
      return <NumberField {...commonProps} value={value} key={key} />;
    case EPropertyType.BOOLEAN:
      return <BooleanField {...commonProps} value={value} key={key} />;
    case EPropertyType.ARRAY:
      return <ArrayField {...commonProps} value={value || []} key={key} />;
    case EPropertyType.FILE:
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
    case EPropertyType.DATASOURCE:
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
    case EPropertyType.OBJECT:
      return <ObjectField {...commonProps} value={value || {}} key={key} />;
    case EPropertyType.RICH_TEXT:
      return <WysiwygField {...commonProps} value={value || {}} key={key} />;
    default:
      return (
        <Spacings.Stack scale="s" key={key}>
          <Text.Detail tone="warning">
            Unsupported field type: {field.type}
          </Text.Detail>
        </Spacings.Stack>
      );
  }
};

export default FieldWrapper;
