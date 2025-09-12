export interface StateInfo<T> {
  draft?: T;
  published?: T;
}

export interface VersionState<T> {
  versions: T[];
  loading: boolean;
  error: string | null;
}

export interface StateManagementState {
  states: {
    draft?: any;
    published?: any;
  };
  currentState: StateInfo<any>;
  loading: boolean;
  error: string | null;
}
