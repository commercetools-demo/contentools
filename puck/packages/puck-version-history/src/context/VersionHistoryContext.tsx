import React, { createContext, useContext } from 'react';
import type { PuckDataDiff } from '../types';

interface VersionHistoryContextValue {
  diff: PuckDataDiff | null;
  isPreviewingHistory: boolean;
}

const VersionHistoryContext = createContext<VersionHistoryContextValue>({
  diff: null,
  isPreviewingHistory: false,
});

export const VersionHistoryProvider: React.FC<{
  diff: PuckDataDiff | null;
  isPreviewingHistory: boolean;
  children: React.ReactNode;
}> = ({ diff, isPreviewingHistory, children }) => (
  <VersionHistoryContext.Provider value={{ diff, isPreviewingHistory }}>
    {children}
  </VersionHistoryContext.Provider>
);

export const useVersionHistoryContext = (): VersionHistoryContextValue =>
  useContext(VersionHistoryContext);
