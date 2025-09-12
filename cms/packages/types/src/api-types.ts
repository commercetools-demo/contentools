export interface ApiResponse<T> {
  container: string;
  key: string;
  value: T;
  version: number;
}
