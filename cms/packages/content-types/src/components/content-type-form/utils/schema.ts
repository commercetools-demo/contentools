import { PropertySchema } from '@commercetools-demo/contentools-types';

const parseDefaultValue = (
  value: string,
  type: PropertySchema['type']
): any => {
  switch (type) {
    case 'number':
      return isNaN(Number(value)) ? 0 : Number(value);
    case 'boolean':
      return value.toLowerCase() === 'true';
    case 'array':
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    case 'object':
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
  type: PropertySchema['type']
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

const getDefaultValuePlaceholder = (type: PropertySchema['type']): string => {
  switch (type) {
    case 'string':
      return 'Enter default text';
    case 'number':
      return 'Enter default number';
    case 'boolean':
      return 'true or false';
    case 'array':
      return '["item1", "item2"]';
    case 'object':
      return '{"key": "value"}';
    case 'file':
      return 'Default file URL';
    case 'datasource':
      return 'Default datasource value';
    default:
      return 'Enter default value';
  }
};

const isDefaultValueVisible = (type: PropertySchema['type']): boolean => {
  switch (type) {
    case 'file':
    case 'datasource':
      return false;
    default:
      return true;
  }
};

export { parseDefaultValue, formatDefaultValue, getDefaultValuePlaceholder, isDefaultValueVisible };
