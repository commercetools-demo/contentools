import { EPropertyType, PropertySchema } from '@commercetools-demo/contentools-types';

const parseDefaultValue = (
  value: string,
  type: EPropertyType
): any => {
  switch (type) {
    case EPropertyType.NUMBER:
      return isNaN(Number(value)) ? 0 : Number(value);
    case EPropertyType.BOOLEAN:
      return value.toLowerCase() === 'true';
    case EPropertyType.ARRAY:
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    case EPropertyType.OBJECT:
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    default:
      return value;
  }
};

const formatDefaultValue = (
  value: any,
  type: EPropertyType
): string => {
  if (value === undefined || value === null) return '';

  switch (type) {
    case 'boolean':
      return String(value);
    case 'array':
    case 'object':
      return JSON.stringify(value);
    default:
      return String(value);
  }
};

const getDefaultValuePlaceholder = (type: EPropertyType): string => {
  switch (type) {
    case EPropertyType.STRING:
      return 'Enter default text';
    case EPropertyType.NUMBER:
      return 'Enter default number';
    case EPropertyType.BOOLEAN:
      return 'true or false';
    case EPropertyType.ARRAY:
      return '["item1", "item2"]';
    case EPropertyType.OBJECT:
      return '{"key": "value"}';
    case EPropertyType.FILE:
      return 'Default file URL';
    case EPropertyType.DATASOURCE:
      return 'Default datasource value';
    case EPropertyType.RICH_TEXT:
      return 'Enter default rich text';
    default:
      return 'Enter default value';
  }
};

const isDefaultValueVisible = (type: EPropertyType): boolean => {
  switch (type) {
    case EPropertyType.FILE:
    case EPropertyType.DATASOURCE:
    case EPropertyType.RICH_TEXT:
      return false;
    default:
      return true;
  }
};

export {
  parseDefaultValue,
  formatDefaultValue,
  getDefaultValuePlaceholder,
  isDefaultValueVisible,
};
