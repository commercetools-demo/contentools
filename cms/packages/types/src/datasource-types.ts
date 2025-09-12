export interface DatasourceInfo {
  name: string;
  key: string;
  params: DatasourceParam[];
  deployedUrl: string;
}

export interface DatasourceParam {
  key: string;
  type: string;
  required: boolean;
}
