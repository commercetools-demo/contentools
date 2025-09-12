import type { DatasourceInfo } from './datasource-types';

export interface PropertySchema {
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'array'
    | 'object'
    | 'file'
    | 'datasource';
  label: string;
  defaultValue?: any;
  required?: boolean;
  options?: { value: any; label: string }[];
  extensions?: string[];
  order?: number;
  datasourceType?: string;
}

export interface ContentTypeMetaData {
  type: string;
  name: string;
  icon?: string;
  defaultProperties: Record<string, any>;
  propertySchema: Record<string, PropertySchema>;
  isBuiltIn?: boolean;
}

export interface ContentTypeData {
  id: string;
  key: string;
  metadata: ContentTypeMetaData;
  code?: {
    componentName: string;
    transpiledCode: string;
    text: string;
  };
}

export interface ContentTypeState {
  contentTypes: ContentTypeData[];
  loading: boolean;
  error: string | null;
  availableDatasources: DatasourceInfo[];
  contentTypesRenderers: Record<string, React.FC<any>>;
}
