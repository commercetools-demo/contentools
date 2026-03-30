import { createContext, useContext } from 'react';

export interface PuckApiContextValue {
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken?: string;
}

export const PuckApiContext = createContext<PuckApiContextValue | null>(null);

export const usePuckApiContext = (): PuckApiContextValue => {
  const ctx = useContext(PuckApiContext);
  if (!ctx) {
    throw new Error(
      'usePuckApiContext must be used inside <PuckApiProvider>. ' +
        'Wrap your component tree with <PuckApiProvider>.'
    );
  }
  return ctx;
};
